import { Nullable } from './helpers'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
import Pagination from './Pagination'


export default interface GeneralLedger {
    companyName:   string;
    currencyCode:  string;
    data:           Datum[];
    downloadToken: string;
    endDate:       Date;
    startDate:     Date;
    summary:        Summary;
    summaryOnly:   boolean;
}

export interface GeneralLedgerResponse {
    company_name:   string;
    currency_code:  string;
    data:           DatumResponse[];
    download_token: string;
    end_date:       Date;
    start_date:     Date;
    summary:        Summary;
    summary_only:   boolean;
}


export function transformgeneralLedgerresponse({
    company_name,
    currency_code,
    data,
    download_token,
    end_date,
    start_date,
    summary,
    summary_only
}: GeneralLedgerResponse): GeneralLedger {
	return {
        companyName: company_name,
        currencyCode: currency_code,
        data: data.map((item) => transformDatumResponse(item)),
        downloadToken: download_token,
        endDate: end_date,
        startDate: start_date,
        summary,
        summaryOnly: summary_only
	}
}

export interface Datum {
    accountName:        string;
    accountNumber:      string;
    accountid:           number;
    credit:              TotalCredit;
    debit:               TotalCredit;
    id:                  number;
    netMovementCredit: TotalCredit;
    netMovementDebit:  TotalCredit;
    subAccounts:        SubAccount[];
}


export interface DatumResponse {
    account_name:        string;
    account_number:      string;
    accountid:           number;
    credit:              TotalCredit;
    debit:               TotalCredit;
    id:                  number;
    net_movement_credit: TotalCredit;
    net_movement_debit:  TotalCredit;
    sub_accounts:        SubAccountResponse[];
}


export function transformDatumResponse({
    account_name,
    account_number,
    accountid,
    credit,
    debit,
    id,
    net_movement_credit,
    net_movement_debit,
    sub_accounts
}: DatumResponse): Datum {
	return {
      accountName: account_name,
      accountNumber: account_number,
      accountid,
      credit,
      debit,
      id,
      netMovementCredit: net_movement_credit,
      netMovementDebit: net_movement_debit,
      subAccounts: sub_accounts.map((item) => transformSubAccountResponse(item))
	}
}

export interface TotalCredit {
    amount: string;
    code:   string;
}

export interface TotalCreditReponse {
    amount: string;
    code:   string;
}

export function transformTotalCreditResponse({
    amount,
    code
}: TotalCreditReponse): TotalCredit {
	return {
     amount,
     code
	}
}

export interface SubAccount {
    credit:              TotalCredit;
    debit:               TotalCredit;
    id:                  number;
    netMovementCredit: TotalCredit;
    netMovementDebit:  TotalCredit;
    subAccountName:    string;
    subAccountNumber:  string;
    subAccountid:       number;
    transactions:        Transaction[];
}

export interface SubAccountResponse {
    credit:              TotalCredit;
    debit:               TotalCredit;
    id:                  number;
    net_movement_credit: TotalCredit;
    net_movement_debit:  TotalCredit;
    sub_account_name:    string;
    sub_account_number:  string;
    sub_accountid:       number;
    transactions:        TransactionResponse[];
}


export function transformSubAccountResponse({
    credit,
    debit,
    id,
    net_movement_credit,
    net_movement_debit,
    sub_account_name,
    sub_account_number,
    sub_accountid,
    transactions,
}: SubAccountResponse): SubAccount {
	return {
     credit,
     debit,
     id,
     netMovementDebit: net_movement_debit,
     netMovementCredit: net_movement_credit,
     subAccountName: sub_account_name,
     subAccountNumber: sub_account_number,
     subAccountid: sub_accountid,
     transactions: transactions.map((item) => transformTransactionResponse(item))
	}
}

export interface Transaction {
    billPaymentid: Nullable<string>;
    billid:         Nullable<string>;
    clientName:    Nullable<string>;
    clientid:       Nullable<number>;
    credit:         TotalCredit;
    creditid:       Nullable<string>;
    date:           Date;
    debit:          TotalCredit;
    description:    string;
    entityType:    string;
    expenseid:       Nullable<string>;
    incomeid:       Nullable<string>;
    invoiceid:       Nullable<number>;
    paymentid:      Nullable<number>;
    reference:      string;
}

export interface TransactionResponse {
    bill_paymentid: Nullable<string>;
    billid:         Nullable<string>;
    client_name:    Nullable<string>;
    clientid:       Nullable<number>;
    credit:         TotalCredit;
    creditid:       Nullable<string>;
    date:           Date;
    debit:          TotalCredit;
    description:    string;
    entity_type:    string;
    expenseid:      Nullable<string>;
    incomeid:       Nullable<string>;
    invoiceid:      Nullable<number>;
    paymentid:      Nullable<number>;
    reference:      string;
}


export function transformTransactionResponse({
    bill_paymentid,
    billid,
    client_name,
    clientid,
    credit,
    creditid,
    date,
    debit,
    description,
    entity_type,
    expenseid,
    incomeid,
    invoiceid,
    paymentid,
    reference,
}: TransactionResponse): Transaction {
	return {
        billPaymentid: bill_paymentid,
        billid,
        clientName: client_name,
        clientid,
        credit,
        creditid,
        date,
        debit,
        description,
        entityType: entity_type,
        expenseid,
        incomeid,
        invoiceid,
        paymentid,
        reference,
	}
}

export interface Summary {
    totalCredit: TotalCredit;
    totalDebit:  TotalCredit;
}


export interface SummaryResponse {
    total_credit: TotalCredit;
    total_debit:  TotalCredit;
}

export function transformSummaryResponse({
   total_credit,
   total_debit
}: SummaryResponse): Summary {
	return {
       totalCredit: total_credit,
       totalDebit: total_debit
	}
}


export function transformListGeneralLedgerResponse(
	data: string
): { generalLedger: GeneralLedger; } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { general_ledger } = response.response.result
	return {
		generalLedger: transformgeneralLedgerresponse(general_ledger)
	}
}