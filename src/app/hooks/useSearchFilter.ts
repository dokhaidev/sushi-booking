import { useMemo } from "react";

type KeyOf<T> = keyof T;

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
  keysToSearch: KeyOf<T>[]
): T[] {
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    const normalizedSearch = removeVietnameseTones(searchText);

    return data.filter((item) =>
      keysToSearch.some((key) => {
        const value = item[key];
        return (
          typeof value === "string" &&
          removeVietnameseTones(value).includes(normalizedSearch)
        );
      })
    );
  }, [data, searchText, keysToSearch]);

  return filteredData;
}
