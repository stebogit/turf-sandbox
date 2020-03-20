import React from 'react';
// import {
//     DropdownMenu, UncontrolledDropdown, DropdownToggle, DropdownItem, CustomInput
// } from 'reactstrap';

function Header () {
    return (
        <header>
            <div className="logo">
                <h1>
                    <a href="https://github.com/Turfjs/turf" target="_blank" rel="noreferrer noopener">
                        TURF
                    </a>
                    <small>sandbox</small>
                </h1>
            </div>
            <div className="tools">
                <a href="https://github.com/stebogit/turf-sandbox" target="_blank" rel="noreferrer noopener">
                    <i className="fab fa-github fa-lg" />
                </a>
                {/*<UncontrolledDropdown>*/}
                {/*    <DropdownToggle color="light" size="sm" caret>*/}
                {/*        <i className="fas fa-cog"/>*/}
                {/*    </DropdownToggle>*/}
                {/*    <DropdownMenu right>*/}
                {/*        <DropdownItem>*/}
                {/*            Item*/}
                {/*        </DropdownItem>*/}
                {/*        <div className="menu-item">*/}
                {/*            <CustomInput type="switch" id="autosave" label="Auto save" checked={autosave} onChange={setAutosave}/>*/}
                {/*        </div>*/}
                {/*    </DropdownMenu>*/}
                {/*</UncontrolledDropdown>*/}
            </div>
        </header>
    );
}

export default Header;
