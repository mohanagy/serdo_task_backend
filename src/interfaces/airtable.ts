import { Document } from "mongoose";



export interface AirtableIntegrationDocument {
  userId: string;
  username: string;
  accessToken: string;
  connectedAt: Date;
}

export interface FILTER_INTERFACE {
  event?: any;
  userId?: string;
  $text?: { $search: string };

}


export interface AirtableBasesDocument extends Document {
  id: string;
  name: string;
  permissionLevel: string;
  fetchedAt: Date;
  userId: string;
}

export interface AirtableTablesDocument extends Document {
  description: string;
  fields: {
    description: string;
    id: string;
    name: string;
    type: string;
    options: {
      isReversed: boolean;
      inverseLinkFieldId: string;
      linkedTableId: string;
      prefersSingleRecordLink: boolean;
    };
  }[];
  id: string;
  name: string;
  primaryFieldId: string;
  views: {
    id: string;
    name: string;
    type: string;
  }[];
  baseId: string;
  userId: string;
  fetchedAt: Date;
}

export interface AirtableTicketsDocument extends Document {
  id: string;
  createdAt: Date;
  fields: {
    Address: string;
    Name: string;
    Visited: boolean;
  };
  baseId: string;
  tableId: string;
  userId: string;
  fetchedAt: Date;
}

export interface AirtableUsersDocument extends Document {
  id: string;
  meta: {
    created: Date;
    location: string;
    resourceType: string;
  };
  name: {
    familyName: string;
    givenName: string;
  };
  schemas: string[];
  userName: string;
  userId: string;
  fetchedAt: Date;
}

export interface GithubOrganizationsUsersDocument extends Document {
  login: string,
  id: string,
  node_id: string,
  avatar_url: string,
  gravatar_id: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: string,
  site_admin: boolean;
  fetchedAt: Date;
  userId: string;
  orgId: string;
}



export interface AirtableRevisionHistoryDocument extends Document {
  uuid: string;
  issueId: string;
  columnType: string;
  oldValue: string;
  newValue: string;
  createdDate: Date;
  authoredBy: string;
}