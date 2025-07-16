"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumb"
import Link from "next/link";
import { Fragment, use } from "react";
import { getCharacterByCharacterId } from "@/app/lib/models/characters";

function findSegmentNamesAndLinks(segments: string[]): [string, string][] {
  return segments.map((segment, index, array) => {
    if (segment.startsWith("character")) {
      return ["Characters", "/characters"]
    } else if (index === 1 && array[0] === "character") {
      return [segment, `/character/${segment}`]
    }

    return ["Indeterminate", "/"]
  })
}

export function Path() {
  const segments = useSelectedLayoutSegments();
  console.log(segments)

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

  const segmentNamesAndLinks = findSegmentNamesAndLinks(segments)

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

