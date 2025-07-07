import { useMemo } from "react";

/** Xóa dấu tiếng Việt để so sánh không phân biệt dấu */
function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD") // tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase(); // chuẩn hóa viết thường
}

export function useSearchFilter<T>(
  data: T[],
  searchText: string,
  keysToSearch: string[] // thay vì KeyOf<T>[]
): T[] {
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    const normalizedSearch = removeVietnameseTones(searchText);

    return data.filter((item) =>
      keysToSearch.some((key) => {
        const keys = key.split(".");
        let value: any = item;
        for (const k of keys) {
          if (value && typeof value === "object") {
            value = value[k];
          } else {
            value = undefined;
            break;
          }
        }
        return (
          typeof value === "string" &&
          removeVietnameseTones(value).includes(normalizedSearch)
        );
      })
    );
  }, [data, searchText, keysToSearch]);

  return filteredData;
}

