import { useState,useEffect } from "react";
import Element from "./components/Elements"
import {Grid,Snackbar,Button,Paper} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './assets/material'
import SendIcon from '@material-ui/icons/Send';
import {regex} from './assets/regexHelper'
// ERROR-UI - Material_UI
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// File starting point
const App = () => {
  const classes = useStyles();  // material-ui styles 
  const [formElements, setFormElements] = useState([]); // store form elements json data // also changes will be stored in this.

  const [error, setError] = useState({     // will store errors to display popup
    open:false,
    msg:'Something Went Wrong!'
  });

  const handleCloseError = (event, reason) => {  // function to close error popup
    if (reason === 'clickaway') {
      return;
    }
    setError({...error,open:false});
  };

  const getFormElements = () => {      // function to fetch form-json-file
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


  useEffect(() => {     // execute once the 1st render finishs
    getFormElements(); // call function to fetch form-json-file
}, [])

const handleChange = (name, e , value=0) => {  // function to handle the changes done in form fields by user.
  const newState = [...formElements];
  newState.forEach(element => {
    if (name === element.name) {
      switch(element.type){  // checks which field to change
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
  setFormElements(newState); // store new changed data to state
}


const handleSubmit = (e) => {   // handle form submit 
  e.preventDefault();           // stop the default behaviour of browser // stops page-reload due to form-submit
  let finalObj = {};            // store form data in json format // "name" : "value"
  
  // perform various checks before submit

  for(let i=0 ; i<formElements.length; i++){  // loop over every field

    if(formElements[i].value === undefined){  // checks if any field is empty -> not entered by user 
      setError({open:true,msg:'Some Fields are missing!'}); 
      return;
    }

    switch(formElements[i].type){    // checks if fields are entered in correct corresponding formats 
      case "name":
        if(formElements[i]['regex-function'] == 'name' && regex.name(formElements[i].value)){ setError({open:true,msg:'Name required!'});return; };
        break;
      case "email":
        // REGEX Checking for Email Format.
        if(formElements[i]['regex-function'] == 'email' && regex.email(formElements[i].value)){
          setError({open:true,msg:'Email Invalid!'});return; 
        }
        break;
      case "password":
        if(formElements[i]['regex-function'] == 'password' && regex.password(formElements[i].value)){ setError({open:true,msg:'Choose strong Password!'});return;};
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
    
    finalObj[formElements[i].name] = formElements[i].value;   // if all checks are passed, store data in "name" : "value" pair.

  }
  // post request of form (finalObj).
  setError({open:false,msg:''})
  console.log(finalObj); 
  alert("Please check console to see form POST data.");
}


// UI - render

if(formElements.length > 0){  // only render if form-json-data is fetched and stored in state.
  return (
    <div className="body">
      <div className="wrapper">
      <div className={classes.root}>
        <Paper elevation={3}>
          <div className="card-head">
            <h2>Registration Form</h2>  {/*Form Heading*/}
          </div>
          <div className="card-body">
            <form>
                <Grid container spacing={0}>
                 
                  {/*Mapping over every json form feilds*/}

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
              {/*Form Submit Button*/}
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
              {/*Error Display UI using Material-UI -> Snackbar*/}
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
  return (<>Loading...</>) //Display Loading till json-form is fetched and stored in state.
}
}

export default App;
