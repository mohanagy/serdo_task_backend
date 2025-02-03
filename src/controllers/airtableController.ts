import { Request, Response } from "express";
import { AirtableIntegration } from '../models/AirtableIntegration';
import axios from 'axios';
import config from '../config';
import AirtableService from '../services/airtable';
import { getPagination } from '../utils/pagination';
import { flattenObject } from '../utils/helpers';


const airtableService = new AirtableService('access_token');
export const handleAirtableCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;
    const storedVerifier = req.session.codeVerifier;
    const storedState = req.session.state;
    if (storedState !== state) {
      throw new Error('Invalid state: possible CSRF attack');
    }

    const tokenUrl = 'https://airtable.com/oauth2/v1/token';
    const { airtable: { clientId, redirectUri, clientSecret } } = config;

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code as string,
      code_verifier: storedVerifier as string,
      redirect_uri: redirectUri,
      client_id: clientId,
    });
    const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${token}`

      },
    });

    const { access_token } = response.data;

    const userId = (req.user as any)?.userId

    await AirtableIntegration.findOneAndUpdate(
      { userId },
      {
        userId,
        accessToken: access_token,
        connectedAt: new Date(),
      },
      { upsert: true }
    );

    delete req.session.codeVerifier;
    delete req.session.state;
    const airtableService = new AirtableService(access_token);
    await airtableService.deleteAirtableData(userId);
    void airtableService.storeData(userId as any);

    return res.redirect('http://localhost:4200/integration');
  } catch (error: any) {
    console.error('handleAirtableCallback error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to exchange code with Airtable' });
    return;
  }
};



export const getAirtableBases = async (req: Request, res: Response): Promise<void> => {
  try {


    const { page, pageSize, sort, searchTerm } = req.query;
    const { limit, skip } = getPagination(page as string, pageSize as string);
    const userId = (req.user as any)?.userId;

    const { data, totalCount } = await airtableService.getAirtableBases(userId, skip, limit, sort as string, searchTerm as string)
    res.json({ data, totalCount });
  }
  catch (error: any) {
    console.error('getAirtableBases error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to get Airtable Bases' });
    return;
  }
}

export const getAirtableTables = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, pageSize, sort, searchTerm } = req.query;
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const userId = (req.user as any)?.userId;

    const { data, totalCount } = await airtableService.getAirtableTables(userId, skip, limit, sort as string, searchTerm as string)
    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ data: flattenedData, totalCount });
  }
  catch (error: any) {
    console.error('getAirtableTables error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to get Airtable Tables' });
    return;
  }
}

export const getAirtableTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, pageSize, sort, searchTerm } = req.query;
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const userId = (req.user as any)?.userId;

    const { data, totalCount } = await airtableService.getAirtableTickets(userId, skip, limit, sort as string, searchTerm as string)
    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ data: flattenedData, totalCount });
  }
  catch (error: any) {
    console.error('getAirtableTickets error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to get Airtable Tickets' });
    return;
  }
}

export const logoutFromAirtable = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId;
    await AirtableIntegration.findOneAndDelete({ userId });
    res.json({ message: 'Logged out from Airtable' });
  } catch (error: any) {
    console.error('logoutFromAirtable error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to logout from Airtable' });
    return;
  }
}

export const getAirtableRevisionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, pageSize, sort, searchTerm } = req.query;
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const userId = (req.user as any)?.userId;

    const { data, totalCount } = await airtableService.getAirtableRevisionHistory(userId, skip, limit, sort as string, searchTerm as string)
    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ data: flattenedData, totalCount });
  }
  catch (error: any) {
    console.error('getAirtableRevisionHistory error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to get Airtable Revision History' });
    return;
  }
}