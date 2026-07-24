import { isPositiveIntegerAmount } from "./currency";
import { fieldtrips } from "../constants/fieldtrips";

const MIN_DESCRIPTION_CHARS = 10;

function meaningfulLength(value) {
  return String(value || "").trim().replace(/\s+/g, "").length;
}

function findFieldtripByName(value) {
  const name = String(value || "").trim();
  return fieldtrips.find((fieldtrip) => fieldtrip.name === name);
}

export function validateField(name, value, form, photos) {
  switch (name) {
    case "employee":
      return value ? "" : "Vui lòng chọn nhân sự.";
    case "fieldtrip": {
      if (!String(value || "").trim()) {
        return "Vui lòng chọn chuyến công tác.";
      }
      return findFieldtripByName(value)
        ? ""
        : "Chuyến công tác này không còn trong danh sách. Vui lòng chọn lại.";
    }
    case "fieldtripCode": {
      if (!String(form?.fieldtrip || "").trim()) {
        return "";
      }

      const selectedFieldtrip = findFieldtripByName(form.fieldtrip);
      if (!selectedFieldtrip) {
        return "";
      }

      return String(value || "").trim() === selectedFieldtrip.code
        ? ""
        : "Mã chuyến công tác không khớp với tên chuyến. Vui lòng chọn lại chuyến công tác.";
    }
    case "expenseDate":
      return value ? "" : "Vui lòng chọn ngày phát sinh.";
    case "expenseTime":
      return value ? "" : "Vui lòng chọn thời gian phát sinh.";
    case "amountRaw":
      if (!value) {
        return "Vui lòng nhập số tiền.";
      }
      return isPositiveIntegerAmount(value)
        ? ""
        : "Số tiền phải là số nguyên lớn hơn 0.";
    case "category":
      return value ? "" : "Vui lòng chọn hạng mục chi phí.";
    case "description":
      if (!String(value || "").trim()) {
        return "Vui lòng nhập nội dung chi tiết.";
      }
      return meaningfulLength(value) >= MIN_DESCRIPTION_CHARS
        ? ""
        : "Nội dung chi tiết cần ít nhất 10 ký tự có nghĩa.";
    case "photos":
      return photos.length > 0 ? "" : "Vui lòng tải lên ít nhất một hình ảnh chứng từ.";
    default:
      return "";
  }
}

export function validateExpenseForm(form, photos) {
  const fields = [
    "employee",
    "fieldtrip",
    "fieldtripCode",
    "expenseDate",
    "expenseTime",
    "amountRaw",
    "category",
    "description",
    "photos",
  ];

  return fields.reduce((errors, field) => {
    const error = validateField(field, form[field], form, photos);
    if (error) {
      errors[field] = error;
    }
    return errors;
  }, {});
}
