"use client";
import React, { useState } from "react";
import AbilityForm from "./AbilityForm";
import SpellForm from "./SpellForm";
import ItemForm from "./ItemForm";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	type: "ability" | "spell" | "item";
}

export default function CreateModal({ isOpen, onClose, type }: Props) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleSubmit = async (data: any) => {
		setIsSubmitting(true);
		setError("");

		try {
			const endpoint = `/api/${type}s`;
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `Failed to create ${type}`);
			}

			onClose();
			// Optionally refresh the page or update state
			window.location.reload();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderForm = () => {
		switch (type) {
			case "ability":
				return <AbilityForm onSubmit={handleSubmit} onCancel={onClose} />;
			case "spell":
				return <SpellForm onSubmit={handleSubmit} onCancel={onClose} />;
			case "item":
				return <ItemForm onSubmit={handleSubmit} onCancel={onClose} />;
			default:
				return null;
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
				)}
				{renderForm()}
				{isSubmitting && (
					<div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
						<div className="spinner">Loading...</div>
					</div>
				)}
			</div>
		</div>
	);
}
