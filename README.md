# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Lyric Workflow Automation

These scripts are available under `scripts/`:

1. `.\scripts\New-LyricVideo.ps1 -SongName <PascalCase> -LrcFile <path> -VideoFile <path>`
2. `.\scripts\Move-CompletedFiles.ps1 -SongName <PascalCase> -DryRun`
3. `.\scripts\Move-CompletedFiles.ps1 -SongName <PascalCase>`
4. `.\scripts\Build-And-Preview.ps1`

`New-LyricVideo.ps1` performs:

- LRC parse -> `src/HelloWorld/<SongName>Data.ts`
- Video component generation from `templates/LyricVideoTemplate.tsx`
- `src/Root.tsx` composition registration
- Optional build (`-SkipBuild` to skip)

## File Placement Rules (Lyric Workflow)

1. Put new source files in `public/suno_PJ/new/`.
2. Avoid spaces in file names.
3. Keep `SongName` in PascalCase for TS identifiers.
4. Move completed media to `public/suno_PJ/done/` using `Move-CompletedFiles.ps1`.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
