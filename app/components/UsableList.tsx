"use client";
import React, { useState } from "react";
import CreateModal from "./CreateModal";
import Form from 'next/form';
import { Button } from "@/app/components/ui/button";
import { ID } from "@/app/lib/types";

interface Column<T> {
	header: string;
	accessor: keyof T;
}

export interface ActionConfig {
	label: string;
	actionUrl: string;
	serverAction?: (formData: FormData) => void | Promise<void>;
}

interface ListProps<T extends { id: ID }> {
	columns: Column<T>[];
	data: T[];
	actions?: ActionConfig[];
	characterId?: ID;
	type?: "ability" | "spell" | "item";
	showCreateButton?: boolean;
}

export default function ListTable<T extends { id: ID }>({
	columns,
	data,
	actions = [],
	characterId,
	type,
	showCreateButton = false,
}: ListProps<T>) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="">
			{showCreateButton && type && (
				<div className="flex justify-end mb-4">
					<button
						onClick={() => setIsModalOpen(true)}
						className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
						Create New {type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
					{isModalOpen && (
						<CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={type} />
					)}
				</div>
			)}
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
										<div key={action.label}>
											{
												(action.serverAction) ? (
													<Form action={action.serverAction}>
														<input type="hidden" name="id" value={record.id} />
														<input type="hidden" name="characterId" value={characterId || ""} />
														<Button
															type="submit"
															className="bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-600">
															+ {action.label}
														</Button>
													</Form>

												) : (
													<form action={action.actionUrl} method="POST">
														<input type="hidden" name="id" value={record.id} />
														<input type="hidden" name="characterId" value={characterId || ""} />
														<button
															type="submit"
															className="bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-600">
															+ {action.label}
														</button>
													</form>
												)
											}
										</div>
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
