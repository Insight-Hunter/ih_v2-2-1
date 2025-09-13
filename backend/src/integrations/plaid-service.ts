import { PlaidApi, Configuration, PlaidEnvironments, AccountsGetRequest, TransactionsGetRequest } from 'plaid';

export class PlaidService {
  private client: PlaidApi;

  constructor(clientId: string, secret: string, env: string = 'sandbox') {
    const configuration = new Configuration({
      basePath: env === 'production' ? PlaidEnvironments.production : PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
    this.client = new PlaidApi(configuration);
  }

  async createLinkToken(userId: string) {
    try {
      const request = {
        user: { client_user_id: userId },
        client_name: 'Insight Hunter',
        products: ['transactions', 'accounts'],
        country_codes: ['US'],
        language: 'en',
      };

      const response = await this.client.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create bank connection');
    }
  }

  async exchangePublicToken(publicToken: string) {
    try {
      const request = { public_token: publicToken };
      const response = await this.client.itemPublicTokenExchange(request);
      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging token:', error);
      throw new Error('Failed to establish bank connection');
    }
  }

  async getAccounts(accessToken: string) {
    try {
      const request: AccountsGetRequest = { access_token: accessToken };
      const response = await this.client.accountsGet(request);
      
      return response.data.accounts.map(account => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances.current,
        currency: account.balances.iso_currency_code || 'USD'
      }));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch account information');
    }
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string) {
    try {
      const request: TransactionsGetRequest = {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        count: 500
      };

      const response = await this.client.transactionsGet(request);
      
      return response.data.transactions.map(transaction => ({
        id: transaction.transaction_id,
        accountId: transaction.account_id,
        amount: Math.abs(transaction.amount),
        type: transaction.amount > 0 ? 'expense' : 'income',
        description: transaction.name,
        date: transaction.date,
        category: transaction.category?.[0] || 'Other',
        merchant: transaction.merchant_name,
        pending: transaction.pending
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  async syncTransactions(accessToken: string, lastSync?: string) {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = lastSync || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      return await this.getTransactions(accessToken, startDate, endDate);
    } catch (error) {
      console.error('Error syncing transactions:', error);
      throw new Error('Failed to sync transactions');
    }
  }
}
