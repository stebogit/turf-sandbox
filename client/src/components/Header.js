import React, { useState } from 'react';
import {
    DropdownMenu, UncontrolledDropdown, DropdownToggle, DropdownItem, CustomInput
} from 'reactstrap';

function Header ({ height }) {
    const [autosave, setAutosave] = useState(1);

    return (
        <header>
            <div className="logo">
                <h1>TURF<small>sandbox</small></h1>
            </div>
            <div className="tools">
                <UncontrolledDropdown>
                    <DropdownToggle color="light" size="sm" caret>
                        <i className="fas fa-cog"/>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            Item
                        </DropdownItem>
                        <div className="menu-item">
                            <CustomInput type="switch" id="autosave" label="Auto save" checked={autosave} onChange={setAutosave}/>
                        </div>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        </header>
    );
}

export default Header;
