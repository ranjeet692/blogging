// Generates a 1200×630 social preview image for the home page and every post at build time.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { APIContext } from 'astro';
import { site } from '../../site.config';
import { getPosts, fmtFull } from '../../lib/posts';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => fs.readFile(require.resolve(`@fontsource/${pkg}/files/${file}`));

type Props = { title: string; year?: string; date?: string };

export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    { params: { slug: 'home' }, props: { title: site.intro } },
    ...posts.map((p) => ({
      params: { slug: p.id },
      props: { title: p.data.title, year: String(p.data.date.getUTCFullYear()), date: fmtFull(p.data.date) },
    })),
  ];
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function GET({ props }: APIContext) {
  const { title, year, date } = props as Props;
  const [sans700, sans500, serif400] = await Promise.all([
    font('schibsted-grotesk', 'schibsted-grotesk-latin-700-normal.woff'),
    font('schibsted-grotesk', 'schibsted-grotesk-latin-500-normal.woff'),
    font('literata', 'literata-latin-400-normal.woff'),
  ]);

  const size = title.length > 90 ? 56 : title.length > 55 ? 64 : 76;

  const tree = h(
    'div',
    {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      background: '#edefea', color: '#1e2b2f', padding: '72px 80px', fontFamily: 'Schibsted',
    },
    [
      h('div', { display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em' }, site.name),
      h('div', { display: 'flex', fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 980 }, title),
      h('div', { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }, [
        h('div', { display: 'flex', fontFamily: 'Literata', fontSize: 28, color: '#56625f' },
          date ?? site.url.replace(/^https?:\/\//, '')),
        h('div', { display: 'flex', fontSize: 132, fontWeight: 700, lineHeight: 0.8, letterSpacing: '-0.06em', color: '#c9d0ca' }, year ?? ''),
      ]),
    ],
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Schibsted', data: sans700, weight: 700, style: 'normal' },
      { name: 'Schibsted', data: sans500, weight: 500, style: 'normal' },
      { name: 'Literata', data: serif400, weight: 400, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
