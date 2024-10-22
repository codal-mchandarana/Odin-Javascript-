/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        mainBg:'rgb(255, 252, 224)',
        playBg:'#B6FDFF',
        borderColor:'rgb(122, 190, 190)',
        playerNameBg:'hsl(46, 100%, 82%)',
        playerNametext:'rgb(185, 28, 0)',
        playerNameBorder:'hsl(46, 80%, 63%)',
        InputBorderColor:'hsl(44, 16%, 77%)',
        InputBg:'hsl(51, 14%, 86%)',
        mark0:'hsl(10, 90%, 55%)',
        markx:'hsl(216, 90%, 55%)',
        scoreColor:'hsl(120, 100%, 36%)',
        heading:'rgb(77, 33, 77)',

        infoBg:'hsl(90, 100%, 70%)',
        infoBorder:'hsl(118, 100%, 42%)',
        infoTextColor:'rgb(185, 28, 0)',

        boardBg:'hsl(56, 23%, 72%)',

        toolbarBorder:'hsl(46, 100%, 40%)',
        toolbarBg:'hsl(46, 100%, 50%)',
        toolbarTextColor:'rgb(185, 28, 0)',
      },
      fontSize:{
        '3xl':'1.6rem',
        '3.5xl':'1.8rem',
        '4xl':'2rem'
      },
      fontWeight:{
        'customBold':'800'
      },
      boxShadow:{
        'custom': '4px 8px 4px 1px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

