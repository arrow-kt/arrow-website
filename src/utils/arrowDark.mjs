import { themes } from 'prism-react-renderer';

const arrowDark = {
  plain: {
    color: '#D4D4D4',
    backgroundColor: '#222E51',
  },
  styles: [
    ...themes.vsDark.styles,
    {
      types: ['title'],
      style: {
        color: '#569CD6',
        fontWeight: 'bold',
      },
    },
    {
      types: ['property', 'parameter'],
      style: {
        color: '#9CDCFE',
      },
    },
    {
      types: ['script'],
      style: {
        color: '#D4D4D4',
      },
    },
    {
      types: ['boolean', 'arrow', 'atrule', 'tag'],
      style: {
        color: '#569CD6',
      },
    },
    {
      types: ['number', 'color', 'unit'],
      style: {
        color: '#cfcd9a',
      },
    },
    {
      types: ['font-matter'],
      style: {
        color: '#CE9178',
      },
    },
    {
      types: ['keyword', 'rule'],
      style: {
        color: '#82a2f3',
      },
    },
    {
      types: ['regex'],
      style: {
        color: '#D16969',
      },
    },
    {
      types: ['maybe-class-name'],
      style: {
        color: '#4EC9B0',
      },
    },
    {
      types: ['constant'],
      style: {
        color: '#4FC1FF',
      },
    },
    {
      types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
      style: {
        color: '#5B88F8',
      },
    },
    {
      types: ['function'],
      style: {
        color: '#EDB368',
      },
    },
    {
      types: ['comment'],
      style: {
        color: '#6b738a',
      },
    },
    {
      types: ['interpolation'],
      style: {
        color: '#b0bee3',
      },
    },
    {
      types: ['label', 'symbol'],
      style: {
        color: '#c57a17',
      },
    },
  ],
};

export { arrowDark };
