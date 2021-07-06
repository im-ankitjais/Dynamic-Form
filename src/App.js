import { useState,useEffect } from "react";
import Element from "./components/Elements"
import {Grid,Snackbar,Button,Paper} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './assets/material'
import SendIcon from '@material-ui/icons/Send';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const App = () => {
  const classes = useStyles();
  const [formElements, setFormElements] = useState([]);

  const [error, setError] = useState({
    open:false,
    msg:'Something Went Wrong!'
  });

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError({...error,open:false});
  };

  const getFormElements = () => {
    fetch("/formElements.json")
      .then((res) => res.json())
      .then((data) => {
        const newState = [...data["form"]];
        newState.forEach(element => {
          if(element['value'] === undefined && element['default'] != undefined){
            element['value'] = element['default'];
          }
        })
        setFormElements(newState);
      })
      .catch((err) => {
        setError({open:true,msg:'Something weny wrong, Please Refresh!'});
      });
  };


  useEffect(() => {
    getFormElements();
}, [])

const handleChange = (name, e , value=0) => {
  const newState = [...formElements];
  newState.forEach(element => {
    if (name === element.name) {
      switch(element.type){
          case "checkbox":
            element['value'] = e.target.checked;
            break;
          case "float":
            element['value'] = value;
            break;
          case "int":
          case "amount":
            element['value'] = parseInt(e.target.value);
            break;
          case "switch":
            element['value'] = e.target.checked;
            break;
          default:
            element['value'] = e.target.value;
            break;
      }
  }})
  setFormElements(newState);
}


const handleSubmit = (e) => {
  e.preventDefault();
  let finalObj = {};
  let submit = true;
  for(let i=0 ; i<formElements.length; i++){
    if(formElements[i].value === undefined){
      console.log(formElements[i].name);
      setError({open:true,msg:'Some Fields are missing!'});
      return;
    }
    switch(formElements[i].type){
      case "name":
        if(formElements[i].value.length <= 0){ setError({open:true,msg:'Name required!'});return; };
        break;
      case "email":
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!(re.test(String(formElements[i].value).toLowerCase()))){
          setError({open:true,msg:'Email Invalid!'});return; 
        }
        break;
      case "password":
        if(formElements[i].value.length <= 6){ setError({open:true,msg:'Choose strong Password!'});return;};
        break;
      case "int":
        if(parseInt(formElements[i].value) <= 0 || parseInt(formElements[i].value) > 100){ setError({open:true,msg:'Age should be between 0-100'});return;};
        break;
      case "multi-line-text":
        if(formElements[i].value.length <= formElements[i]['min-length'] || formElements[i].value.length > formElements[i]['max-length']){ setError({open:true,msg:'Invalid length of characters in multiline Text'});return;};
        break;
      case "multi-select":
        if(formElements[i].value.length < 1){ setError({open:true,msg:'Choose atleast 1 option'});return;};
        break;
      case "single-select":
        if(formElements[i].value === '' && formElements[i].required == true){ setError({open:true,msg:'Single Choice Field required'});return;};
        break;
      case "float":
        if(formElements[i].value < formElements[i]['min-value'] || formElements[i].value > formElements[i]['max-value']){ setError({open:true,msg:'Rating should hold 1-5.'});return;};
        break;
      case "toggle":
        if(formElements[i].value === '' && formElements[i].required == true){ setError({open:true,msg:'Gender Required'});return;};
        break;
      case "link":
        break;
      case "amount":
        if(parseInt(formElements[i].value) < formElements[i]['min-value'] || parseInt(formElements[i].value) > formElements[i]['max-value']){ setError({open:true,msg:'Amount value invalid!'});return;};
        break;
      default:
        break;
  }
    finalObj[formElements[i].name] = formElements[i].value;
  }

  console.log(error.open)
  console.log(finalObj);
  // alert("Please check browser console to see submit details.")
}




if(formElements.length > 0){
  return (
    <div className="body">
      <div className="wrapper">
      <div className={classes.root}>
        <Paper elevation={3}>
          <div className="card-head">
            <h2>Registration Form</h2>
          </div>
          <div className="card-body">
            <form>
                <Grid container spacing={0}>
              {formElements.map((item,i) => (
                <Grid item className={classes.grid} xs={item.space}>
                <div className="form-name">{item.name}</div>
                <div className="form-value">
                  <div className="input-group">
                    <Element key={i} data={item} handleChange={handleChange}  />
                  </div>
                </div>
                </Grid>
              ))}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    endIcon={<SendIcon />}
                    onClick={(e) => handleSubmit(e)}
                  >
                    Submit
                  </Button>
                </Grid>
                
            </form>
          </div>
        </Paper>
      </div>
    </div>
    <div className={classes.snackbar}>
      <Snackbar open={error.open} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error.msg}
        </Alert>
      </Snackbar>
      </div>
    </div>
  );
}
else{
  return (<>Loading...</>)
}
}

export default App;
