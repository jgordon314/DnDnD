"use client";
import React from "react";

interface Column<T> {
	header: string;
	accessor: keyof T;
}

export interface ActionConfig {
	label: string;
	actionUrl: string;
}

interface ListProps<T extends { id: number }> {
	columns: Column<T>[];
	data: T[];
	actions?: ActionConfig[];
	characterId?: number;
}

export default function ListTable<T extends { id: number }>({
	columns,
	data,
	actions = [],
	characterId,
}: ListProps<T>) {
	return (
		<div>
			<table className="border-collapse border-spacing-0 w-full">
				<thead>
					<tr>
						{columns.map((col) => (
							<th key={String(col.accessor)} className="border-b border-gray-300 p-2 text-left">
								{col.header}
							</th>
						))}
						{actions.length > 0 && <th className="border-b border-gray-300 p-2 text-left">Actions</th>}
					</tr>
				</thead>
				<tbody>
					{data.map((record) => (
						<tr key={record.id}>
							{columns.map((col) => (
								<td
									key={String(col.accessor)}
									className="border-b border-gray-200 p-2 whitespace-pre-wrap">
									{String(record[col.accessor])}
								</td>
							))}
							{actions.length > 0 && (
								<td className="border-b border-gray-200 p-2 whitespace-pre-wrap">
									{actions.map((action) => (
										<form action={action.actionUrl} method="POST" key={action.label}>
											<input type="hidden" name="id" value={record.id} />
											<input type="hidden" name="characterId" value={characterId || ""} />
											<button
												type="submit"
												className="bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-600">
												+ {action.label}
											</button>
										</form>
									))}
								</td>
							)}
						</tr>
					))}
					{data.length === 0 && (
						<tr>
							<td
								colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
								className="py-4 px-4 text-center text-gray-500">
								No items found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
