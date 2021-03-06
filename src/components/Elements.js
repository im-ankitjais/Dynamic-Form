import React from 'react'
import {TextField,Input,Switch,ListItemText,Checkbox,FormControlLabel,FilledInput,InputLabel,InputAdornment,MenuItem,FormControl,FormLabel,Select,Radio,RadioGroup} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import useStyles from '../assets/material'

// File starting point
const Element = ({data,handleChange}) => {  
/* Props - data: individual form element,
        handleChange: function to call when user try to change field value.
*/
    const classes = useStyles(); // material-ui styles 

    /*
    Used Material-UI Fields: 
            -- Textfield, Input, Select, Checkbox, Rating, RadioGroup .

    To Know more / Documentation : visit:- https://material-ui.com/
    */

    switch (data.type) {    // checks which field to display based on element type.
        case 'text':
        case 'password':
        case 'link':
        case 'email':
            return (<TextField           //for text, password, email        
                id="filled-full-width"
                className={classes.textField}
                placeholder={data.name}
                fullWidth
                type={data.type}
                margin="normal"
                value={data.value?data.value:data.default?data.default:''}
                onChange={(e) => handleChange(data.name,e)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />)

        case 'date':   
            return (<TextField   //for date
                id="date"
                type="date"
                value={data.value?data.value:''}
                onChange={(e) => handleChange(data.name,e)}
                required={data.required}
                defaultValue="2017-05-24"
                InputLabelProps={{
                  shrink: true,
                }}
            />)
        case 'multi-line-text':
            return ( 
            <TextField   // multi line text area
                id="filled-full-width"
                className={classes.textField}
                placeholder={data.default}
                fullWidth
                multiline
                type={data.type}
                InputLabelProps={{
                    shrink: true,
                    minLength:data["min-length"],
                    maxLength: data["max-length"]
                }}
                required={data.required}
                value={data.value?data.value:''}
                onChange={(e) => handleChange(data.name,e)}
                variant="filled"
              />
            )
        case 'multi-select':
            return (           
            <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">Select</InputLabel>
            <Select             //for multiple select options , checkboxes
                id="demo-mutiple-checkbox"
                multiple
                value={data.value?data.value:[]}
                onChange={(e) => handleChange(data.name,e)}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
              >
              {data.list.length > 0 && data.list.map(name => (      // mapping over the list of options
                <MenuItem key={name} value={name}>
                <Checkbox checked={data.value?data.value.indexOf(name) > -1:false} />
                <ListItemText primary={name} />
                </MenuItem>
              ))}
              </Select></FormControl>)
        case 'single-select':
            return (
            <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">Select</InputLabel>
            <Select                 //for single select dropdown
                native
                value={data.value?data.value:''}
                onChange={(e) => handleChange(data.name,e)}
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
              >
              <option aria-label="None" value="" />
              {data.list.map(name => (              // mapping over the list of options
                <option value={name}>{name}</option>
              ))}
              </Select></FormControl>)
        case 'int':
            return (<TextField              // for age int value
                id="standard-number"
                type="number"
                defaultValue={data.default}
                value={data.value && data.value}
                onChange={(e) => handleChange(data.name,e)}
                required={data.required}
                inputProps={{
                    min:data["min-value"],
                    max: data["max-value"]
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />)
        case 'float':
            return (<Rating           // for rating stars 1-5
                name="simple-controlled"
                required={data.required}
                defaultValue={data.default}
                value={data.value?data.value:data.default}
                onChange={(e, newValue) => {
                    handleChange(data.name,e,newValue);
                }}
              />)
        case 'toggle':
            return (           // for radio-group options // single select
            <RadioGroup className={classes.radioInput}  aria-label={data.name} name={data.name} value={data.value?data.value:data.default} onChange={(e) => handleChange(data.name,e)}>
                {data.options.map(opt => (
                    <FormControlLabel value={opt} control={<Radio />} label={opt} />
                ))}
            </RadioGroup>
          )
        case 'amount':
            return (
                <FormControl fullWidth className={classes.textField} variant="filled">
                    <FilledInput          // for amount field with currency sign // more options available on website:https://material-ui.com/ 
                        id="filled-adornment-amount"
                        type="number"
                        inputProps={{
                            min: 0, max: 1000
                        }}
                        value={data.value?data.value:null}
                        onChange={(e) => handleChange(data.name,e)}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    />
                </FormControl>
            )
        case 'switch':
            return( 
                <Switch   // for toggle options // yes/no
                    checked={data.value?data.value:data.default}
                    onChange={(e) => handleChange(data.name,e)}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            )
        default:  // if form field type does not match, cannot display that field.
            return null;
    }


}

export default Element     // exporting as default