import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';
import { videosSchema } from 'starlight-videos/schemas';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: (context) => blogSchema(context).and(videosSchema),
      // extend: 
      //   (context) =>
      //   blogSchema(context).extend({
      //     // Optional 4-digit year; accepts number or string and coerces to number
      //     year: z.coerce.number().int().min(1800).max(2100).optional(),
      //   }),
       

        
    }),
  }),
};
