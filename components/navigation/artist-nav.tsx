import type React from "react"
import Link from "next/link"

interface ArtistNavProps {
  artistId: string
}

const ArtistNav: React.FC<ArtistNavProps> = ({ artistId }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link href={`/artists/${artistId}`}>
            <a>Overview</a>
          </Link>
        </li>
        <li>
          <Link href={`/artists/${artistId}/releases`}>
            <a>Releases</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default ArtistNav
