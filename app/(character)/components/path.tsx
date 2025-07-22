"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumb"
import Link from "next/link";
import { Character, ID } from "@/app/lib/types";

function findSegmentNamesAndLinks(segments: string[], characterNameById: Record<ID, string>): [string, string][] {
  return segments.map((segment, index, array) => {
    if (segment.startsWith("character")) {
      return ["Characters", "/characters"]
    } else if (segment.startsWith("item")) {
      return ["Items", "/items"]
    } else if (segment.startsWith("spell")) {
      return ["Spells", "/spells"]
    } else if (segment.startsWith("abilit")) {
      return ["Abilities", "/abilities"]
    } else if (index === 1 && array[0] === "characters" && array[1] === "new") {
      return ["New Character", "/characters/new"]
    } else if (index === 1 && array[0] === "items" && array[1] === "new") {
      return ["New Item", "/items/new"]
    } else if (index === 1 && array[0] === "spells" && array[1] === "new") {
      return ["New Spell", "/spells/new"]
    } else if (index === 1 && array[0] === "abilities" && array[1] === "new") {
      return ["New Abilities", "/spells"]
    } else if (index === 1 && array[0] === "character") {
      return [characterNameById[Number(segment)] || "Indeterminate", `/character/${segment}`]
    }

    return ["Indeterminate", "/"]
  })
}

function PathItem({
  name,
  href,
  isLast,
}: {
  name: string,
  href: string,
  isLast: boolean,
}) {
  if (isLast) {
    return (
      <BreadcrumbItem>
        <BreadcrumbPage>{name}</BreadcrumbPage>
      </BreadcrumbItem>
    )
  } else {
    return (
      <>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href={href}>
              {name}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
      </>
    )
  }
}



export function Path({
  characters,
}: {
  characters: Character[]
}) {
  const segments = useSelectedLayoutSegments();

  const characterNameById = Object.fromEntries(characters.map(c => [c.id, c.name]))
  const segmentNamesAndLinks = findSegmentNamesAndLinks(segments, characterNameById)

  const breadcrumbEntries = segmentNamesAndLinks.map(([name, href], index, array) =>
    <PathItem name={name} href={href} isLast={index === array.length - 1} key={index} />
  )

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbEntries}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

