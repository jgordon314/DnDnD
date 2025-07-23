"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumb"
import Link from "next/link";
import { Character, ID } from "@/app/lib/types";

function findSegmentNamesAndLinks(segments: string[], characterNameById: Record<ID, string>): [string, string][] {
  return segments.flatMap((segment, index, array) => {
    if (index === 0 && segment.startsWith("character")) {
      return [["Characters", "/characters"]]
    } else if (index === 0 && segment.startsWith("item")) {
      return [["Items", "/items"]]
    } else if (index === 0 && segment.startsWith("spell")) {
      return [["Spells", "/spells"]]
    } else if (index === 0 && segment.startsWith("abilit")) {
      return [["Abilities", "/abilities"]]
    } else if (index === 1 && array[0] === "characters" && segment === "new") {
      return [["New Character", "/characters/new"]]
    } else if (index === 1 && array[0] === "items" && segment === "new") {
      return [["New Item", "/items/new"]]
    } else if (index === 1 && array[0] === "spells" && segment === "new") {
      return [["New Spell", "/spells/new"]]
    } else if (index === 1 && array[0] === "abilities" && segment === "new") {
      return [["New Abilities", "/spells"]]
    } else if (index === 2 && segment === "add") {
      return []
    } else if (index === 3 && array[2] === "add" && segment === "items") {
      return [["Add Items", `/character/${array[1]}/add/items`]]
    } else if (index === 3 && array[2] === "add" && segment === "spells") {
      return [["Add Spells", `/character/${array[1]}/add/spells`]]
    } else if (index === 3 && array[2] === "add" && segment === "abilties") {
      return [["Add Abilities", `/character/${array[1]}/add/abilities`]]
    } else if (index === 1 && array[0] === "character") {
      return [[characterNameById[Number(segment)] || "Indeterminate", `/character/${segment}`]]
    }

    return [["Indeterminate", "/"]]
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

