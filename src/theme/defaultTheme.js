const defaultTheme = {
  Map: {
    backgroundFill: '#212c42',
    verticalLines: 7,
    horizontalLines: 2,
    District: {
      normal: {
        border: '#ff0',
      },
      hover: {
        border: '#0ff',
      },
      active: {
        border: '#0ff',
      },
      inactive: {
        border: '#066',
      },
    },
    Region: {
      normal: {
        fill: '#435166',
        stroke: '#000',
      },
      hover: {
        fill: '#435166',
        stroke: '#000',
      },
      active: {
        fill: '#435166',
        stroke: '#000',
      },
      inactive: {
        fill: 'rgba(255, 255, 0, 0.5)',
        stroke: '#000',
      },
    },
    Info: {
      normal: {
        backgroundFillLow: '#7ac84f',
        backgroundFillMedium: '#65d7d2',
        backgroundFillHigh: '#fc7752',
        radius: 20.5,
        titleColor: '#FFF',
        titleSize: '15px',
        percentColor: '#FFF',
        percentSize: '13px',
      },
      hover: {
        backgroundFillLow: '#7ac84f',
        backgroundFillMedium: '#65d7d2',
        backgroundFillHigh: '#fc7752',
        radius: 20.5,
        titleColor: '#FFF',
        titleSize: '15px',
        percentColor: '#FFF',
        percentSize: '13px',
      },
    },
    Controls: {
      ZoomOut: {
        normal: {
          backgroundFill: '#fff',
          signFill: '#212c42',
          radius: 20,
        },
        hover: {
          backgroundFill: '#999',
          signFill: '#212c42',
          radius: 20,
        },
      },
      ZoomIn: {
        normal: {
          backgroundFill: '#fff',
          signFill: '#212c42',
          radius: 20,
        },
        hover: {
          backgroundFill: '#999',
          signFill: '#212c42',
          radius: 20,
        },
      },
      Flag: {
        normal: {
          backgroundFill: '#fff',
          signFill: '#212c42',
          radius: 26,
          counterFill: '#2aa0f5',
          counterColor: '#fff',
        },
        hover: {
          backgroundFill: '#999',
          signFill: '#212c42',
          radius: 26,
          counterFill: '#2aa0f5',
          counterColor: '#fff',
        },
      },
    },
  },

};

export default defaultTheme;
