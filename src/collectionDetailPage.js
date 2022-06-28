import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Col, Row, Button, Modal, Form } from "react-bootstrap";
import facepaint from "facepaint";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

const REQLISTANIME = gql`
  query ($id: Int, $page: Int, $perPage: Int, $id_in: [Int]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id: $id, id_in: $id_in) {
        id
        title {
          romaji
        }
        coverImage {
          extraLarge
        }
      }
    }
  }
`;

function CollectionDetailPage() {
  const [collectionName, setCollectionName] = useState("");
  const [collection, setCollection] = useState("");
  const [listAnime, setListAnime] = useState([]);

  const location = useLocation();
  const { id } = location.state;

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const onInput = ({ target: { value } }) => setCollectionName(value);

  useEffect(() => {
    let temp = [];
    if (localStorage.getItem("collections") !== null) {
      temp = JSON.parse(localStorage.getItem("collections"));
      setListAnime(temp[id].listAnime);
      setCollection(temp[id]);
    }
    console.log(collection);
    console.log(listAnime);
  }, []);

  const openEditDialog = () => {
    console.log(showModal);
    var temp = JSON.parse(localStorage.getItem("collections"));
    setCollectionName(temp[id].collectionName);
    handleShow();
  };

  const saveCollections = () => {
    var arrayOfCollections = JSON.parse(localStorage.getItem("collections"));
    console.log(arrayOfCollections);
    arrayOfCollections[id].collectionName = collectionName;
    localStorage.setItem("collections", JSON.stringify(arrayOfCollections));
    setCollection(arrayOfCollections[id]);
    setShowModal(false);
  };

  console.log("ini list Anime: " + listAnime);

  const CollectionAnimeList = () => {
    const { loading, error, data } = useQuery(REQLISTANIME, {
      variables: {
        page: 1,
        id_in: listAnime,
      },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.log(data);

    return data.Page.media.map(({ id, title, coverImage }) => (
      <Row
        key={id}
        css={mq({
          paddingTop: "5px",
          paddingBottom: "5px",
        })}
      >
        <Col md={2} xs={3}>
          <Link to="/anime_details" state={{ id: id }}>
            <img
              src={coverImage.extraLarge}
              alt={coverImage.extraLarge}
              css={mq({
                width: "100%",
                maxHeight: "auto",
                float: "left",
              })}
            ></img>
          </Link>
        </Col>
        <Col md={6} xs={5}>
          <p
            css={mq({
              float: "left",
            })}
          >
            {title.romaji}
          </p>
        </Col>
        <Col xs={4}>
          <Button
            css={mq({
              float: "right",
            })}
            variant="danger"
          >
            Remove
          </Button>
        </Col>
      </Row>
    ));
  };

  return (
    <div>
      <Row>
        <Col>
          <h1
            css={mq({
              float: "left",
            })}
          >
            Collection : {collection.collectionName}
          </h1>
        </Col>
        <Col>
          <Button
            css={mq({
              float: "right",
            })}
            variant="success"
            onClick={() => openEditDialog()}
          >
            Edit
          </Button>
        </Col>
      </Row>
      {listAnime.length > 0 ? (
        <CollectionAnimeList />
      ) : (
        <p>Currently there is no anime in this collection</p>
      )}

      <Modal show={showModal} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Collections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Collection Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insert your collection name"
                value={collectionName}
                onChange={onInput}
              />
            </Form.Group>
            <Button variant="primary" onClick={saveCollections}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CollectionDetailPage;
