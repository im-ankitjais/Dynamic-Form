
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& .MuiPaper-rounded':{
        borderRadius:'10px'
      },
      '& > *': {
        margin: theme.spacing(1),
        width: '100%',
        minHeight: '90vh',
      },
    },
    textField:{
      margin: '8px',
      '& .MuiInputBase-root':{
        '& input':{
          padding: '20px 12px 15px',
        },
      },
      '& .MuiFilledInput-underline:before':{
        display: 'none'
      }
    },
    grid:{
      display:'flex',
      alignItems:'center',
      flexWrap: 'wrap',
      '-webkit-box-align': 'center',
      alignItems: 'center',
      marginBottom: '40px',
    },
    snackbar:{
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
        border: `1px solid white`,
        flex: 1,
        padding: '8px',
        '&[type=number]': {
          '-moz-appearance': 'textfield',
        },
        '&input[type=number]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0,
        },
        '&input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0,
        },
      },
      formControl:{
          backgroundColor: '#e5e5e5',
          margin: theme.spacing(1),
          minWidth: 120,
          maxWidth: 300,
        '& .MuiFilledInput-underline:before':{
            display: 'none'
        },
        '& .MuiInput-underline:before':{
          display: 'none'
        }
      },
      textField:{
        margin: '0 10px 0 0',
        '& .MuiFilledInput-multiline':{
            padding: '20px 12px 15px',
          },
        '& .MuiInputBase-root':{
          '& input':{
            padding: '20px 12px 15px',
          },
        },
        '& .MuiFilledInput-underline:before':{
          display: 'none'
        }
      },
      radioInput:{
          flexDirection: 'row'
      }
  }));

  export default useStyles