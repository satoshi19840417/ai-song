# Lyric Templates

This directory stores reusable templates for lyric-video generation.

## Files

- `LyricVideoTemplate.tsx`: Standard horizontal lyric video template.
- `VerticalLyricVideoTemplate.tsx`: Vertical-writing lyric video template.
- `DataTemplate.ts`: Minimal `*Data.ts` structure.

## Placeholder Tokens

- `__SONG_NAME__`: PascalCase song name identifier.
- `__COMPONENT_NAME__`: React component name (usually `${SongName}Video`).
- `__SCHEMA_NAME__`: Zod schema constant name (usually `camelCaseSongNameSchema`).

## Typical Flow

1. Parse `.lrc` and generate `src/HelloWorld/<SongName>Data.ts`.
2. Copy `LyricVideoTemplate.tsx` to `src/HelloWorld/<SongName>Video.tsx`.
3. Replace placeholder tokens.
4. Register the composition with `scripts/Add-Composition.ps1`.
