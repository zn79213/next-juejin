import clsx from 'clsx'
import React from 'react'

export default function TableContents(props) {
  switch (props.tagName) {
    case 'nav': {
      return (
        <nav {...props.properties}>{props.children.map((item, index) => {
          return <TableContents {...item} key={index} idTable={props.idTable} />
        })}</nav>
      )
    };
    case 'ol': {
      return (
        <ol {...props.properties}>{props.children.map((item, index) => {
          return <TableContents {...item} key={index} idTable={props.idTable} />
        })}</ol>
      )
    };
    case 'li': {
      return (
        <li {...props.properties}>{props.children.map((item, index) => {
          return <TableContents {...item} key={index} idTable={props.idTable} />
        })}</li>
      )
    };
    case 'a': {
      return (
        <a {...props.properties} className={clsx('block py-1 text-sm font-medium hover:text-[#428dcc] focus:outline-none dark:hover:text-gray-200 focus-visible:text-gray-700 dark:opacity-90 dark:focus-visible:text-gray-200 text-gray-400', props.properties.href == '#' + props.idTable && 'text-[#428dcc] dark:text-gray-200')}>{props.children.map((item, index) => {
          return <TableContents {...item} key={index} />
        })}</a>
      )
    };
    default: return (
      <>{props.value}</>
    )
  }
}
