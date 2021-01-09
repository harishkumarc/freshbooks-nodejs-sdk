import { Nullable } from './helpers'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Pagination from './Pagination'

/* eslint-disable @typescript-eslint/camelcase */
export default interface JournalEntryDetail {
    account:             Account;
    accountingSystemid: string;
    balance:             Nullable<Balance>;
    credit:              Nullable<Balance>;
    debit:               Nullable<Balance>;
    description:         string;
    detailType:         string;
    detailid:            number;
    entry:               Entry;
    id:                  number;
    name:                string;
    subAccount:         SubAccount;
    userEnteredDate:   Date;
}


export interface JournalEntryDetailResponse {
    account:             AccountResponse;
    accounting_systemid: string;
    balance:             Nullable<BalanceResponse>;
    credit:              Nullable<BalanceResponse>;
    debit:               Nullable<BalanceResponse>;
    description:         string;
    detail_type:         string;
    detailid:            number;
    entry:               EntryResponse;
    id:                  number;
    name:                string;
    sub_account:         SubAccountReponse;
    user_entered_date:   Date;
}



export function transformJournalEntryDetailData({
    account,
    accounting_systemid,
    balance,
    credit,
    debit,
    description,
    detail_type,
    detailid,
    entry,
    id,
    name,
    sub_account,
    user_entered_date
}: JournalEntryDetailResponse): JournalEntryDetail {
	return {
		account: transformAccountResponse(account),
		accountingSystemid: accounting_systemid,
		balance: balance !== null? transformBalanceResponse(balance): balance,
		credit: credit !== null? transformBalanceResponse(credit): credit,
		debit: debit !== null? transformBalanceResponse(debit): debit,
		description,
		detailType: detail_type,
		detailid,
		entry: transformEntryResponse(entry),
		id,
		name,
		subAccount: transformSubAccountResponse(sub_account),
		userEnteredDate: user_entered_date
	}
}

export interface Account {
    accountName:        string;
    accountNumber:      string;
    accountType:        string;
    accountid:           number;
    accountingSystemid: string;
    id:                  number;
}

export interface AccountResponse {
    account_name:        string;
    account_number:      string;
    account_type:        string;
    accountid:           number;
    accounting_systemid: string;
    id:                  number;
}


export function transformAccountResponse({
	account_name,
	account_number,
	account_type,
	accountid,
	accounting_systemid,
	id,
}: AccountResponse): Account {
	return {
		accountName: account_name,
		accountNumber: account_number,
		accountType:account_type,
		accountid:accountid,
		accountingSystemid:accounting_systemid,
		id:id
	}
}

export interface Balance {
    amount: string;
    code:   string;
}



export interface BalanceResponse {
    amount: string;
    code:   string;
}


export function transformBalanceResponse({
    amount,
    code
}: BalanceResponse): Balance {
	return {
	  amount,
	  code
	}
}

export interface Entry {
    accountingSystemid: string;
    clientid:            Nullable<string>;
    creditid:            Nullable<string>;
    entryid:             number;
    expenseid:           number;
    id:                  number;
    incomeid:            Nullable<string | number>;
    invoiceid:           Nullable<string | number>;
    paymentid:           Nullable<string | number>;
}



export interface EntryResponse {
    accounting_systemid: string;
    clientid:            Nullable<string>;
    creditid:            Nullable<string>;
    entryid:             number;
    expenseid:           number;
    id:                  number;
    incomeid:            Nullable<string | number>;
    invoiceid:           Nullable<string | number>;
    paymentid:           Nullable<string | number>;
}


export function transformEntryResponse({
    accounting_systemid,
	clientid,
	creditid,
	entryid,
	expenseid,
	id,
	incomeid,
	invoiceid,
	paymentid
}: EntryResponse): Entry {
	return {
	  accountingSystemid: accounting_systemid,
	  clientid,
	  creditid,
	  entryid,
	  expenseid,
	  id,
	  incomeid,
	  invoiceid,
	  paymentid
	}
}


export interface SubAccount {
    accountSubName:    string;
    accountSubNumber:  string;
    accountingSystemid: string;
    id:                  number;
    parentid:            number;
    subAccountid:       number;
}


export interface SubAccountReponse {
	account_sub_name: string,
	account_sub_number: string,
	accounting_systemid: string,
	id: number,
	parentid: number,
	sub_accountid: number
}



export function transformSubAccountResponse({
	account_sub_name,
	account_sub_number,
	accounting_systemid,
	id,
	parentid,
	sub_accountid
}: SubAccountReponse): SubAccount {
	return {
		accountSubName: account_sub_name,
		accountSubNumber: account_sub_number,
		accountingSystemid: accounting_systemid,
		id,
		parentid,
		subAccountid: sub_accountid
	}
}




export function transformListJournalEntryDetailResponse(
	data: string
): { journalEntryDetails: JournalEntryDetail[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { journal_entry_details, per_page, total, page, pages } = response.response.result
	return {
		journalEntryDetails: journal_entry_details.map((invoice: any) => transformJournalEntryDetailData(invoice)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}

export function transformJournalEntryDetailResponse(data: string): JournalEntryDetail | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const {
		response: { result },
	} = response
	const { JournalEntryDetail } = result
	return transformJournalEntryDetailData(JournalEntryDetail)
}