import React, {useState, useEffect} from 'react';
import {DropdownMenu, UncontrolledDropdown, DropdownToggle, DropdownItem} from 'reactstrap';
import GistListModal from './GistListModal';
import SavedGistModal from './SavedGistModal';
import {GITHUB_CLIENT_ID, GIST_FILENAME} from './../constants';

const storedAuthDetails = JSON.parse(localStorage.getItem('auth_details'));
if (storedAuthDetails && Date.now() > storedAuthDetails.expire) {
    localStorage.removeItem('auth_details');
}

const url = new URL(window.location.href);
const accessToken = url.searchParams.get('access_token');

const content = `// simply return a valid GeoJSON and it will be rendered on the map!
const poly = turf.polygon([[
  [11.339607, 44.505626], [11.326990, 44.499382], [11.329479, 44.490382],
  [11.339693, 44.486402], [11.356258, 44.484443], [11.358060, 44.485729],
  [11.356172, 44.501035], [11.347761, 44.504280], [11.339607, 44.505626]
]], {
  stroke: '#F00',
  fill: '#F00',
  'fill-opacity': 0.3,
});

const point = turf.point([11.342, 44.495], {
  'marker-color': '#F00',
  'marker-symbol': 'B',
});

return turf.featureCollection([poly, point]);
`;

function User () {
    const [user, setUser] = useState(storedAuthDetails ? storedAuthDetails.user : null);
    const [showListModal, setShowListModal] = useState(false);
    const [showSavedGistModal, toggleSavedGistModal] = useState(false);

    useEffect(() => {
        if (!user && accessToken) {
            window.history.replaceState(null, '', url.origin);

            // get the authenticated user
            fetch('https://api.github.com/user', {
                headers: {
                    Authorization: 'token ' + accessToken,
                    Accept: 'application/json',
                }
            })
                .then(response => response.json())
                .then((user) => {
                    console.log(user);
                    setUser(user);
                    localStorage.setItem('auth_details', JSON.stringify({
                        expire: Date.now() + 1000 * 60 * 60,
                        user,
                        access_token: accessToken,
                    }));
                })
                .catch((e) => {
                    console.error(e);
                    alert('Authentication failed');
                });
        }

        // return function cleanup () {};
    }, []);

    const logOut = () => {
        localStorage.removeItem('auth_details');
        window.location.reload();
    };

    const toggleListModal = () => setShowListModal(!showListModal);

    const saveGist = () => {
        fetch(`https://api.github.com/gists`, {
            method: 'POST',
            headers: {
                Authorization: 'token ' + accessToken,
                Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                description: 'turf-sandbox snippet',
                public: true,
                files: {
                    'script.turf-sandbox': {content},
                }
            }),
        })
            .then(response => response.json())
            .then((result) => {
                console.log(result);
                console.log(result.files[GIST_FILENAME].raw_url);
                alert('Saved at ' + result.html_url);
            })
            .catch((e) => {
                console.error(e);
                alert('Sorry, an error occurred while fetching your gists.');
            });
    };

    if (!user) {
        return (
            <a
                className="btn btn-link login" title="Login with GitHub"
                href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=gist`}
            >
                <i className="fas fa-sign-in-alt"/> Login
            </a>
        );
    }

    return (
        <>
            <UncontrolledDropdown>
                <DropdownToggle color="link" className="avatar-btn" caret>
                    <img alt={`Avatar of ${user.name}`} className="avatar-img" title={user.name}
                         src={`${user.avatar_url}`}/>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={saveGist}>
                        <i className="fas fa-save"/> Save to Gist
                    </DropdownItem>
                    <DropdownItem onClick={toggleListModal}>
                        <i className="fas fa-cloud-download-alt"/> Load from Gist
                    </DropdownItem>
                    <DropdownItem onClick={logOut}>
                        <i className="fas fa-sign-out-alt"/> Logout
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>

            <GistListModal show={showListModal} onClose={toggleListModal} username={user.login}/>
            <SavedGistModal show={showSavedGistModal} onClose={toggleSavedGistModal} username={user.login}/>
        </>
    );
}

export default User;
