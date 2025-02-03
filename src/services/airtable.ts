import config from '../config';
import axios, { AxiosInstance } from 'axios';
import { airtableEndpoints } from '../utils/constants';
import { AirtableBases } from '../models/AirtableBases';
import { AirtableTables } from '../models/AirtableTables';
import { AirtableTickets } from '../models/AirtableTickets';
import { AirtableUsers } from '../models/AirtableUsers';
import { getAirtableSessionCookies, getRevisionHistory } from '../utils/taskScrapping';
import { transformInput } from '../utils/helpers';
import { AirtableRevisionHistory } from '../models/AirtableRevisionHistory';


class AirtableService {
  private airtable: AxiosInstance;
  private accessToken: string;
  private sessionSig?: string;
  private airtableSession?: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.airtable = axios.create({
      baseURL: config.airtable.baseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public async fetchProjectsData(offset?: string, pageSize?: number, sort?: string) {
    try {
      const params: any = {};
      if (offset) params.offset = offset;
      if (pageSize) params.pageSize = pageSize;
      if (sort) params.sort = sort;
      const { data } = await this.airtable.get(airtableEndpoints.BASES, { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  public async fetchTablesData(baseId: string, offset?: string, pageSize?: number, sort?: string) {
    try {
      const endpoint = airtableEndpoints.TABLES.replace("{baseId}", baseId);
      const params: any = {};
      if (offset) params.offset = offset;
      if (pageSize) params.pageSize = pageSize;
      if (sort) params.sort = sort;
      const { data } = await this.airtable.get(endpoint, { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  public async fetchTicketsData(baseId: string, tableId: string, offset?: string, pageSize?: number, sort?: string) {
    try {
      const endpoint = airtableEndpoints.TABLE.replace("{baseId}", baseId).replace("{tableId}", tableId);
      const params: any = {};
      if (offset) params.offset = offset;
      if (pageSize) params.pageSize = pageSize;
      if (sort) params.sort = sort;
      const { data } = await this.airtable.get(endpoint, { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  public fetchViewsData(baseId: string, tableId: string, offset?: string, pageSize?: number, sort?: string) {
    try {
      const endpoint = airtableEndpoints.TABLE.replace("{baseId}", baseId).replace("{tableId}", tableId);
      const params: any = {};
      if (offset) params.offset = offset;
      if (pageSize) params.pageSize = pageSize;
      if (sort) params.sort = sort;
      return this.airtable.get(endpoint, { params });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  public async fetchUsersData(offset?: string, pageSize?: number, sort?: string) {
    try {
      const params: any = {};
      if (offset) params.offset = offset;
      if (pageSize) params.pageSize = pageSize;
      if (sort) params.sort = sort;
      const { data } = await this.airtable.get(airtableEndpoints.USERS, { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  public async loadData(userId: string) {
    try {
      let projectsData: any = [];
      let tablesData: any = [];
      let ticketsData: any = [];
      let revisionHistoryData: any = [];
      let offset: string | undefined = undefined;

      do {
        const { bases: projects, offset: newOffset } = await this.fetchProjectsData(offset);
        offset = newOffset;
        const projectData = projects.map((project: any) => ({ ...project, userId, fetchedAt: new Date() }));
        projectsData.push(...projectData);

        for await (const project of projects) {
          let tableOffset: string | undefined = undefined;

          do {
            const { tables, offset: newTableOffset } = await this.fetchTablesData(project.id, tableOffset);
            tableOffset = newTableOffset;
            const tableData = tables.map((table: any) => ({ ...table, baseId: project.id, fetchedAt: new Date(), userId }));
            tablesData.push(...tableData);
            for await (const table of tables) {
              let ticketOffset: string | undefined = undefined;

              do {
                const { records: tickets, offset: newTicketOffset } = await this.fetchTicketsData(project.id, table.id, ticketOffset);
                ticketOffset = newTicketOffset;
                const ticketData = tickets.map((ticket: any) => ({ ...ticket, baseId: project.id, tableId: table.id, fetchedAt: new Date(), userId }));
                ticketsData.push(...ticketData);

                for await (const ticket of tickets) {
                  if (!this.sessionSig || !this.airtableSession) {
                    const { sessionSig, airtableSession } = await getAirtableSessionCookies(config.airtable.clientId, config.airtable.redirectUri);
                    this.sessionSig = sessionSig;
                    this.airtableSession = airtableSession;
                  }
                  try {
                    if (this.sessionSig && this.airtableSession) {
                      const _revisionHistory = await getRevisionHistory(project.id, table.id, ticket.id, this.sessionSig, this.airtableSession);
                      const transformedRevisionHistory = transformInput(_revisionHistory.data, ticket.id);
                      const revisionHistory = transformedRevisionHistory.map((history: any) => ({ ...history, userId }))
                        .filter((history: any) => ['Status', 'Assigned to'].includes(history.columnType));
                      revisionHistoryData.push(...revisionHistory);
                    }
                  } catch (error: any) {
                    if (error.message === 'Request failed with status code 401') {
                      const { sessionSig, airtableSession } = await getAirtableSessionCookies(config.airtable.clientId, config.airtable.redirectUri);
                      this.sessionSig = sessionSig;
                      this.airtableSession = airtableSession;
                      if (this.sessionSig && this.airtableSession) {
                        const revisionHistory = await getRevisionHistory(project.id, table.id, ticket.id, this.sessionSig, this.airtableSession)
                          .catch((error: any) => {
                            console.log(error.message);
                          });
                        if (revisionHistory) {
                          const _revisionHistory = await getRevisionHistory(project.id, table.id, ticket.id, this.sessionSig, this.airtableSession);
                          const transformedRevisionHistory = transformInput(_revisionHistory.data, ticket.id);
                          const revisionHistory = transformedRevisionHistory.map((history: any) => ({ ...history, userId }))
                            .filter((history: any) => ['Status', 'Assigned to'].includes(history.columnType));

                          revisionHistoryData.push(...revisionHistory);
                        }
                      }
                    }
                  }
                }
              } while (ticketOffset);
            }
          } while (tableOffset);
        }
      } while (offset);

      return { projects: projectsData, tables: tablesData, tickets: ticketsData, revisionHistory: revisionHistoryData, users: [] };
    } catch (error) {
      console.log(error);
      return { projects: [], tables: [], tickets: [], users: [] };
    }
  }

  public async storeData(userId: string) {
    const { projects, tables, tickets, revisionHistory } = await this.loadData(userId);
    if (projects.length) {
      await AirtableBases.insertMany(projects);
    }
    if (tables.length) {
      await AirtableTables.insertMany(tables);
    }
    if (tickets.length) {
      await AirtableTickets.insertMany(tickets);
    }
    if (revisionHistory.length) {
      await AirtableRevisionHistory.insertMany(revisionHistory);
    }
  }
  public async revokeAccess() {
    try {
      const { data } = await this.airtable.delete(airtableEndpoints.REVOKE);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
  public async getAirtableBases(userId: string, skip: number, limit: number, sort: string, searchTerm: string) {
    try {
      const filter: any = { userId };
      if (searchTerm) {
        filter.$text = { $search: searchTerm };
      }
      const totalCount = await AirtableBases.countDocuments(filter);
      const data = await AirtableBases
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort);
      return { totalCount, data };
    } catch (error) {
      // console.log(error)
      return { totalCount: 0, data: [] };
    }
  }

  public async getAirtableTables(userId: string, skip: number, limit: number, sort: string, searchTerm: string) {
    try {
      const filter: any = { userId };
      if (searchTerm) {
        filter.$text = { $search: searchTerm };
      }
      const totalCount = await AirtableTables.countDocuments(filter);
      const data = await AirtableTables
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort);
      return { totalCount, data };
    } catch (error) {
      // console.log(error)
      return { totalCount: 0, data: [] };
    }
  }

  public async getAirtableTickets(userId: string, skip: number, limit: number, sort: string, searchTerm: string) {
    try {
      const filter: any = { userId, };
      if (searchTerm) {
        filter.$text = { $search: searchTerm };
      }
      const totalCount = await AirtableTickets.countDocuments(filter);
      const data = await AirtableTickets
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort);
      return { totalCount, data };
    } catch (error) {
      // console.log(error)
      return { totalCount: 0, data: [] };
    }
  }

  public async getAirtableUsers(userId: string, skip: number, limit: number, sort: string, searchTerm: string) {
    try {
      const filter: any = { userId };
      if (searchTerm) {
        filter.$text = { $search: searchTerm };
      }
      const totalCount = await AirtableUsers.countDocuments(filter);
      const data = await AirtableUsers
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort);
      return { totalCount, data };
    } catch (error) {
      // console.log(error)
      return { totalCount: 0, data: [] };
    }
  }
  public async getAirtableRevisionHistory(userId: string, skip: number, limit: number, sort: string, searchTerm: string) {
    try {
      const filter: any = { userId };
      if (searchTerm) {
        filter.$text = { $search: searchTerm };
      }
      const totalCount = await AirtableRevisionHistory.countDocuments(filter);
      const data = await AirtableRevisionHistory
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort);
      return { totalCount, data };
    } catch (error) {
      // console.log(error)
      return { totalCount: 0, data: [] };
    }
  }

  public async deleteAirtableData(userId: string) {
    try {
      await AirtableBases.deleteMany({ userId });
      await AirtableTables.deleteMany({ userId });
      await AirtableTickets.deleteMany({ userId });
      await AirtableUsers.deleteMany({ userId });
      await AirtableRevisionHistory.deleteMany({ userId });
      return;
    } catch (error) {
      // console.log(error)
      return;
    }
  }
}

export default AirtableService;
