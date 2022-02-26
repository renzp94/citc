// css module
declare module '*.module.css' {
  interface Classes {
    [key: string]: string
  }
  const classes: Classes
  export default classes
}
// less css module
declare module '*.module.less' {
  interface Classes {
    [key: string]: string
  }
  const classes: Classes
  export default classes
}
// scss css module
declare module '*.module.scss' {
  interface Classes {
    [key: string]: string
  }
  const classes: Classes
  export default classes
}
// sass css module
declare module '*.module.sass' {
  interface Classes {
    [key: string]: string
  }
  const classes: Classes
  export default classes
}
// font
declare module '*.woff'
declare module '*.woff2'
declare module '*.eot'
declare module '*.ttf'
declare module '*.otf'
// images
declare module '*.png'
declare module '*.svg'
declare module '*.svg'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
