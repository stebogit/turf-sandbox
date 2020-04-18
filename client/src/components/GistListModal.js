import React, {useState, useEffect, useRef} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Loader from './Loader';
import {GIST_FILENAME, url} from '../constants';

function GistListModal ({show, onClose, username}) {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const urlRef = useRef(url);

    useEffect(() => {
        fetch(`https://api.github.com/users/${username}/gists`)
            .then(async (response) => {
                if (response.status >= 400) throw new Error();

                const gists = await response.json();
                const list = gists.reduce((l, g) => {
                    if (g.files[GIST_FILENAME]) {
                        l.push({
                            ...g.files[GIST_FILENAME],
                            id: g.id,
                            html_url: g.html_url,
                            description: g.description,
                        });
                    }
                    return l;
                }, []);

                setList(list);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
                alert('Sorry, an error occurred while fetching your gists.');
            });
    }, [username]);

    const loadGist = async (gist) => {
        urlRef.current.searchParams.set('gist', gist.id);
        window.location.reload();
    };

    return (
        <Modal isOpen={show} toggle={onClose} scrollable className="gist-list">
            <ModalHeader toggle={onClose}>Modal title</ModalHeader>
            <ModalBody>
                {list.length ? (
                    <ul className="gists">
                        {list.map(gist => (
                            <li key={gist.id} className="gist">
                                <a className="btn btn-link btn-sm" title="View on gist.github.com"
                                   href={gist.html_url} target="_blank" rel="noreferrer noopener"
                                >
                                    <i className="fas fa-eye"/>
                                    <span style={{fontSize: '70%', display: 'inline-flex'}}>
                                       <i className="fas fa-external-link-alt"/>
                                    </span>
                                </a>
                                {' '}
                                {gist.filename}
                                {' '}
                                <Button color="default" size="sm" title="Load" onClick={() => loadGist(gist)}>
                                    <i className="fas fa-arrow-alt-circle-right fa-2x" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <sman className="text-muted"><em>- No Gists found -</em></sman>
                )}
            </ModalBody>
            <ModalFooter>
                <Button size="sm" color="secondary" onClick={onClose}>Cancel</Button>
            </ModalFooter>
            <Loader show={loading}/>
        </Modal>
    );
}

export default GistListModal;
