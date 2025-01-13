import { DropdownButton, Dropdown } from 'react-bootstrap';

//console.log(Dropdown)

export const MyDropdown = ({ label, selectedValue, options, onSelectedValueChange }) => {
  return (
    <div className="menus-container">
      <label className="dropdown-label" htmlFor="dropdown-basic">
        {label}
      </label>
      
      <Dropdown className="MyDropdown-root">
        <Dropdown.Toggle className="custom-dropdown-toggle">
          {selectedValue}
          
        </Dropdown.Toggle>
       
        <Dropdown.Menu className="MyDropdown-menu">
          {options.map(option => (
            <Dropdown.Item 
              key={option.value} 
              onClick={() => onSelectedValueChange(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );

};






