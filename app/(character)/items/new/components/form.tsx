"use client";
import React, { useState, useEffect } from "react";
import { Ability } from "../../../../lib/types";
import { redirect } from "next/navigation";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useRouter } from "next/navigation";

export function NewItemForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [abilityId, setAbilityId] = useState<number | null>(null);
	const [abilities, setAbilities] = useState<Ability[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const router = useRouter();

	useEffect(() => {
		const fetchAbilities = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/abilities");
				if (!response.ok) {
					throw new Error("Failed to fetch abilities");
				}
				const data = await response.json();
				console.log("abilities", data);
				setAbilities(data);
			} catch (error) {
				console.error("Error fetching abilities:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAbilities();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setIsError(false);

		const formData = {
			name,
			description,
			ability_id: abilityId,
		};

		console.log("Creating item:", formData);
		try {
			const response = await fetch("/api/items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to create item");
			}

			router.push("/items");
		} catch (error) {
			setIsLoading(false);
			setErrorText(error instanceof Error ? error.message : String(error))
			setIsError(true);
		}
	};

	return (
		<>
			<h1 className="text-3xl mb-10">New Item</h1>
			<form
				onSubmit={handleSubmit}
				className="form scrollable-form flex flex-col gap-5"
			>
				{isError &&
					<Alert variant="destructive">
						<AlertTitle>Failed to create item</AlertTitle>
						<AlertDescription>
							{errorText}
						</AlertDescription>
					</Alert>
				}

				<div className="grid w-full max-w-sm items-center gap-3">
					<Label htmlFor="name">Name</Label>
					<Input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className="grid w-full gap-3">
					<Label htmlFor="description">Description</Label>
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe the item's properties, effects, and other details. For example: A sword that flickers with icy blue flames. Deals fire and cold damage. Cost: 10 gp, Weight: 3 lbs, Damage: 1d8 + 1d4 cold."
						rows={6}
						required
					/>
				</div>

				<div className="grid w-full gap-3">
					<Label htmlFor="ability">Associated Ability (Optional)</Label>
					{isLoading ? (
						<div>Loading abilities...</div>
					) : (
						<>
							<Select
								value={String(abilityId) || ""}
								onValueChange={(value) => setAbilityId(value ? parseInt(value) : null)}
							>
								<SelectTrigger className="min-w-20">
									<SelectValue placeholder="Associate an ability..." />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Abilities</SelectLabel>
										{abilities.map((ability) => (
											<SelectItem key={ability.id} value={String(ability.id)}>{ability.name}</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2 md:flex-row">
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2Icon className="animate-spin" />}
						Create Item
					</Button>
				</div>
			</form>
		</>
	);
}
