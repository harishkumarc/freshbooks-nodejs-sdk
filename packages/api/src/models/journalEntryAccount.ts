import { Nullable } from './helpers'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Pagination from './Pagination'

/* eslint-disable @typescript-eslint/camelcase */

export default interface JournalEntryAccount {
    accountName:   string;
    accountNumber: string;
    accountType:   string;
    accountid:      number;
    balance:        string;
    currencyCode:  string;
    id:             number;
    subAccounts:   SubAccount[];
}


export interface JournalEntryAccountResponse {
	account_name:   string;
    account_number: string;
    account_type:   string;
    accountid:      number;
    balance:        string;
    currency_code:  string;
    id:             number;
    sub_accounts:   SubAccountResponse[];
}

export interface SubAccount {
    accountSubName:   string;
    accountSubNumber: string;
    accountType:       string;
    balance:            string;
    currencyCode:      string;
    custom:             boolean;
    id:                 number;
    parentid:           number;
    subAccountid:      number;
}

export interface SubAccountResponse {
    account_sub_name:   string;
    account_sub_number: string;
    account_type:       string;
    balance:            string;
    currency_code:      string;
    custom:             boolean;
    id:                 number;
    parentid:           number;
    sub_accountid:      number;
}


export function transformSubAccountResponse({
	account_sub_name,
    account_sub_number,
    account_type,
    balance,
    currency_code,
    custom,
    id,
    parentid,
    sub_accountid,
}: SubAccountResponse): SubAccount {
	return {
		accountSubName: account_sub_name,
		accountSubNumber: account_sub_number,
		accountType: account_type,
		balance,
		currencyCode: currency_code,
		custom,
		id,
		parentid,
		subAccountid: sub_accountid
	}
}


export function transformJournalEntryAccountData({
	account_name,
    account_number,
    account_type,
    accountid,
    balance,
    currency_code,
    id,
    sub_accounts,
}: JournalEntryAccountResponse): JournalEntryAccount {
	return {
		accountName: account_name,
		accountNumber: account_number,
		accountType:account_type,
		accountid:accountid,
		balance,
		currencyCode: currency_code,
		id,
		subAccounts: sub_accounts.map((item) => transformSubAccountResponse(item))
	}
}




export function transformListJournalEntryAccountResponse(
	data: string
): { journalEntryAccounts: JournalEntryAccount[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}


	const { journal_entry_accounts, per_page, total, page, pages } = response.response.result
	return {
		journalEntryAccounts: journal_entry_accounts.map((invoice: any) => transformJournalEntryAccountData(invoice)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}

export function transformJournalEntryAccountResponse(data: string): JournalEntryAccount | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response
	const { journal_entry_accounts } = result
	return transformJournalEntryAccountData(journal_entry_accounts)
}