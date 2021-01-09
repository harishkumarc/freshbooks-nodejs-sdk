import { Nullable } from './helpers'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Pagination from './Pagination'

export default interface AccountsAging {
    accounts:       Account[];
    companyName:   string;
    currencyCode:  string;
    downloadToken: string;
    endDate:       Date;
    totals:         { [key: string]: Total };
}

export interface AccountsAgingResponse {
    accounts:       AccountResponse[];
    company_name:   string;
    currency_code:  string;
    download_token: string;
    end_date:       Date;
    totals:         { [key: string]: Total };
}


export function transformAccountsAgingResponse({
   accounts,
   company_name,
   currency_code,
   download_token,
   end_date,
   totals
}: AccountsAgingResponse): AccountsAging {
	return {
        accounts: accounts.map((item: AccountResponse) => transformAccountResponse(item)),
        companyName: company_name,
        currencyCode: currency_code,
        downloadToken: download_token,
        endDate: end_date,
        totals
	}
}


export interface Account {
    "0-30":       Total;
    "31-60":      Total;
    "61-90":      Total;
    "91+":        Total;
    email:        string;
    fname:        string;
    lname:        string;
    organization: string;
    total:        Total;
    userid:       number;
}


export interface AccountResponse {
    "0-30":       TotalResponse;
    "31-60":      TotalResponse;
    "61-90":      TotalResponse;
    "91+":        TotalResponse;
    email:        string;
    fname:        string;
    lname:        string;
    organization: string;
    total:        TotalResponse;
    userid:       number;
}


export function transformAccountResponse(account: AccountResponse): Account {
     return {
        "0-30": transformTotalResponse(account["0-30"]),
        "31-60": transformTotalResponse(account["31-60"]),
        "61-90": transformTotalResponse(account["61-90"]),
        "91+": transformTotalResponse(account["91+"]),
        email: account.email,
        fname: account.fname,
        lname: account.lname,
        organization: account.organization,
        total: transformTotalResponse(account.total),
        userid: account.userid
     }
 }


export interface Total {
    amount: string;
    code:   string;
}

export interface TotalResponse {
    amount: string;
    code:   string;
}


export function transformTotalResponse({
    amount,
    code
 }: TotalResponse): Total {
     return {
       amount,
       code 
     }
 }


 export function transformListAccountsAgingResponse(
	data: string
): { accountsAging: AccountsAging; } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { accounts_aging } = response.response.result
	return {
	   accountsAging: transformAccountsAgingResponse(accounts_aging)
	}
}

