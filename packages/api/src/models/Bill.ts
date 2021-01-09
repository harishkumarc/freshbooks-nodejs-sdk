import { transformLineRequest } from "./Line";
import { Nullable } from './helpers'
import Pagination from './Pagination'
import { transformErrorResponse, isAccountingErrorResponse, ErrorResponse } from './Error'
export default interface Bill {
    amount:              Amount;
    attachment:          null;
    billNumber:         null;
    billPayments:       any[];
    createdAt:          Date;
    currencyCode:       string;
    dueDate:            Date;
    dueOffsetDays:     number;
    id:                  number;
    issueDate:          Date;
    language:            string;
    lines:               Line[];
    outstanding:         Amount;
    overallCategory:    string;
    overallDescription: string;
    paid:                Amount;
    status:              string;
    taxAmount:          Amount;
    totalAmount:        Amount;
    updatedAt:          Date;
    visState:           number;
}

export interface BillResponse {
    amount:              Amount;
    attachment:          null;
    bill_number:         null;
    bill_payments:       any[];
    created_at:          Date;
    currency_code:       string;
    due_date:            Date;
    due_offset_days:     number;
    id:                  number;
    issue_date:          Date;
    language:            string;
    lines:               LineResponse[];
    outstanding:         Amount;
    overall_category:    string;
    overall_description: string;
    paid:                Amount;
    status:              string;
    tax_amount:          Amount;
    total_amount:        Amount;
    updated_at:          Date;
    vis_state:           number;
}

export function transformBillResponse({
    amount,
    attachment,
    bill_number,
    bill_payments,
    created_at,
    currency_code,
    due_date,
    due_offset_days,
    id,
    issue_date,
    language,
    lines,
    outstanding,
    overall_category,
    overall_description,
    paid,
    status,
    tax_amount,
    total_amount,
    updated_at,
    vis_state
}: BillResponse) :Bill {
    return {
        amount,
        attachment,
        billNumber: bill_number,
        billPayments:   bill_payments,
        createdAt:   created_at,
        currencyCode:    currency_code,
        dueDate:      due_date,
        dueOffsetDays:    due_offset_days,
        id,
        issueDate: issue_date,
        language,
        lines: lines.map((line) => transformLineReponse(line)),
        outstanding,
        overallCategory:    overall_category,
        overallDescription:  overall_description,
        paid,
        status,
        taxAmount: tax_amount,
        totalAmount:  total_amount,
        updatedAt:  updated_at,
        visState:   vis_state
    }
}

export interface Amount {
    amount: string;
    code:   string;
}

export interface AmountResponse {
    amount: string;
    code:   string;
}

export function transformAmountReponse({
    amount,
    code
}: AmountResponse): Amount {
  return {
    amount,
    code
  }
}

export interface Line {
    amount:           Amount;
    category:         Category;
    description:      string;
    id:               number;
    listIndex:       number;
    quantity:         string;
    taxAmount1:      null;
    taxAmount2:      null;
    taxAuthorityid1: null;
    taxAuthorityid2: null;
    taxName1:        null;
    taxName2:        null;
    taxPercent1:     null;
    taxPercent2:     null;
    totalAmount:     Amount;
    unitCost:        Amount;
}

export interface LineResponse {
    amount:           Amount;
    category:         CategoryResponse;
    description:      string;
    id:               number;
    list_index:       number;
    quantity:         string;
    tax_amount1:      null;
    tax_amount2:      null;
    tax_authorityid1: null;
    tax_authorityid2: null;
    tax_name1:        null;
    tax_name2:        null;
    tax_percent1:     null;
    tax_percent2:     null;
    total_amount:     Amount;
    unit_cost:        Amount;
}


export function transformLineReponse({
    amount,
    category,
    description,
    id,
    list_index,
    quantity,
    tax_amount1,
    tax_amount2,
    tax_authorityid1,
    tax_authorityid2,
    tax_name1,
    tax_name2,
    tax_percent1,
    tax_percent2,
    total_amount,
    unit_cost
}: LineResponse): Line {
  return {
    amount,
    category: transformCategoryResponse(category),
    description,
    id,
    listIndex: list_index,
    quantity,
    taxAmount1: tax_amount1,
    taxAmount2: tax_amount2,
    taxAuthorityid1: tax_authorityid1,
    taxAuthorityid2: tax_authorityid2,
    taxName1:        tax_name1,
    taxName2:        tax_name2,
    taxPercent1:     tax_percent1,
    taxPercent2:     tax_percent2,
    totalAmount:     total_amount,
    unitCost:       unit_cost
  }
}

export interface Category {
    category:    string;
    categoryid:  number;
    createdAt:  Date;
    id:          number;
    isCogs:     boolean;
    isEditable: boolean;
    parentid:    number;
    updatedAt:  Date;
    visState:   number;
}


export interface CategoryResponse {
    category:    string;
    categoryid:  number;
    created_at:  Date;
    id:          number;
    is_cogs:     boolean;
    is_editable: boolean;
    parentid:    number;
    updated_at:  Date;
    vis_state:   number;
}


export function transformCategoryResponse({
    category,
    categoryid,
    created_at,
    id,
    is_cogs,
    is_editable,
    parentid,
    updated_at,
    vis_state
} : CategoryResponse): Category {
    return {
        category,
        categoryid,
        createdAt: created_at,
        id,
        isCogs: is_cogs,
        isEditable: is_editable,
        parentid,
        updatedAt: updated_at,
        visState: vis_state
    }
}


export function transformListBillsResponse(
	data: string
): { bills: Bill[]; pages: Pagination } | ErrorResponse {
	const response = JSON.parse(data)

	if (isAccountingErrorResponse(response)) {
		return transformErrorResponse(response)
	}

	const { bills, per_page, total, page, pages } = response.response.result
	return {
		bills: bills.map((bill: any) => transformBillResponse(bill)),
		pages: {
			page,
			pages,
			size: per_page,
			total,
		},
	}
}
