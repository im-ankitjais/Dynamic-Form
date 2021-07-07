import { useState,useEffect } from "react";
import Element from "./components/Elements"
import {Grid,Snackbar,Button,Paper} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './assets/material'
import SendIcon from '@material-ui/icons/Send';
import {nameRegex,emailRegex,passwordRegex,urlRegex} from './assets/regexHelper'
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
          if(element['value'] === undefined){
            if(element['default'] != undefined){
              element['value'] = element['default'];
            }else{
              element['value'] = '';
            }
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

    switch(formElements[i].type){    // checks if fields are entered in correct corresponding formats 
      case "text":
        // REGEX Checking for Name Format.
        if(formElements[i].required == true){ 
          if((formElements[i]['regex-function'] == 'name' && !nameRegex(formElements[i].value)) || formElements[i].value == ''){ setError({open:true,msg:`${formElements[i].name} value Invalid!`});return; };
        }
        break;
      case "email":
        // REGEX Checking for Email Format.
        if(formElements[i]['regex-function'] == 'email'){
          if(!emailRegex(formElements[i].value)){
          setError({open:true,msg:`${formElements[i].name} Invalid!`});return;
          } 
        }
        break;
      case "password":
        // REGEX Checking for strict-password Format.
        if(formElements[i]['regex-function'] == 'strict-password'){
          if(!passwordRegex(formElements[i].value)){ setError({open:true,msg:'Choose strong Password!'});return;};
        }
        break;
      case "int":
      if(formElements[i].required == true && (parseInt(formElements[i].value) <= formElements[i]['min-value'] || parseInt(formElements[i].value) > formElements[i]['max-value'])){ setError({open:true,msg:`${formElements[i].name} should be between ${formElements[i]['min-value']}-${formElements[i]['max-value']}`});return;};
        break;
      case "multi-line-text":
        if(formElements[i].required == true && (formElements[i].value.length <= formElements[i]['min-length'] || formElements[i].value.length > formElements[i]['max-length'])){ setError({open:true,msg:`Invalid length of characters in ${formElements[i].name}`});return;};
        break;
      case "multi-select":
        if(formElements[i].value.length < formElements[i]['min-choice'] || formElements[i].value.length > formElements[i]['max-choice']){ setError({open:true,msg:`Min:${formElements[i]['min-choice']}Max:${formElements[i]['max-choice']} are allowed in ${formElements[i].name}.`});return;};
        break;
      case "single-select":
        if(formElements[i].value === '' && formElements[i].required == true){ setError({open:true,msg:`${formElements[i].name} required`});return;};
        break;
      case "float":
        if(formElements[i].required == true && (formElements[i].value < formElements[i]['min-value'] || formElements[i].value > formElements[i]['max-value'])){ setError({open:true,msg:`${formElements[i].name} should hold ${formElements[i]['min-value']}-${formElements[i]['max-value']}.`});return;};
        break;
      case "toggle":
        if(formElements[i].value === '' && formElements[i].required == true){ setError({open:true,msg:`${formElements[i]['name']} Required`});return;};
        break;
      case "link":
        if(formElements[i].required == true){
          if(formElements[i].value === '' || (formElements[i]['regex-function'] == 'url' && !urlRegex(formElements[i].value))){
          setError({open:true,msg:`${formElements[i].name} Invalid!`});return;
          } 
        }
        break;
      case "date":
        if(formElements[i].required == true && formElements[i].value==''){setError({open:true,msg:`${formElements[i]['name']} Required`});return;}
        break;
      case "amount":
        console.log(formElements[i]['min-value'])
        console.log(parseInt(formElements[i].value))
        if(formElements[i].required == true){
          if(formElements[i].value == '' || (parseInt(formElements[i].value) < formElements[i]['min-value'] || parseInt(formElements[i].value) > formElements[i]['max-value'])){
            setError({open:true,msg:`${formElements[i]['name']} value Should hold between ${formElements[i]['min-value']}-${formElements[i]['max-value']}`});return;
          }
        }
        break;
      case "switch":
        if(formElements[i].required == true && formElements[i].value === ''){setError({open:true,msg:`${formElements[i]['name']} field Required`});return;}
      default:
        break;
  }
    
    finalObj[formElements[i].name] = formElements[i].value;   // if all checks are passed, store data in "name" : "value" pair.

  }
  // post request of form (finalObj).
  setError({open:false,msg:''})
  console.log("FORM POST DATA:-"); 
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
