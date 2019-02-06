import { Config } from '@stencil/core';
import { less } from '@stencil/less';

export const config: Config = {
  namespace: 'rating',
  plugins: [
    less()
  ],
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
