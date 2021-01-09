import { Nullable } from './helpers'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Pagination from './Pagination'
export default interface TrialBalance {
    companyName:   string;
    currencyCode:  string;
    data:           Datum[];
    downloadToken: string;
    endDate:       Date;
    startDate:     Date;
}


export interface TrialBalanceResponse {
    company_name:   string;
    currency_code:  string;
    data:           DatumResponse[];
    download_token: string;
    end_date:       Date;
    start_date:     Date;
}


export function transformTrialBalanceResponse({
    company_name,
    currency_code,
    data,
    download_token,
    end_date,
    start_date,
}: TrialBalanceResponse): TrialBalance {
	return {
      companyName: company_name,
      currencyCode: currency_code,
      data: data.map((item: DatumResponse) => transformDatumResponse(item)),
      downloadToken: download_token,
      endDate: end_date,
      startDate: start_date
	}
}

export interface Datum {
    accountName:       string;
    accountNumber:     null | string;
    accountSubName:   null | string;
    accountSubNumber: null | string;
    credit:             Credit;
    debit:              Credit;
    subAccountid:      number | null;
}

export interface DatumResponse {
    account_name:       string;
    account_number:     null | string;
    account_sub_name:   null | string;
    account_sub_number: null | string;
    credit:             CreditResponse;
    debit:              CreditResponse;
    sub_accountid:      number | null;
}



export function transformDatumResponse({
    account_name,
    account_number,
    account_sub_name,
    account_sub_number,
    credit,
    debit,
    sub_accountid
}: DatumResponse): Datum {
	return {
     accountName: account_name,
     accountNumber: account_number,
     accountSubName: account_sub_name,
     accountSubNumber: account_sub_number,
     credit: transformCreditResponse(credit),
     debit: transformCreditResponse(debit),
     subAccountid: sub_accountid
	}
}

export interface Credit {
    amount: string;
    code:   string;
}

export interface CreditResponse {
    amount: string;
    code:   string;
}

export function transformCreditResponse({
   amount,
   code
}: CreditResponse): Credit {
	return {
        amount,
        code
	}
}



export function transformListTrialBalanceResponse(
	data: string
): { trialBalance: TrialBalance; } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { trial_balance } = response.response.result
	return {
		trialBalance: transformTrialBalanceResponse(trial_balance)
	}
}