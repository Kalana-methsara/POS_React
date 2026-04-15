type Column<T> = {
  header: string;
  key?: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Array<Column<T>>;
  data: T[];
};

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-bold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {col.render ? col.render(row) : col.key ? (row as any)[col.key] : null}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 italic">
                No customers found in the system.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;