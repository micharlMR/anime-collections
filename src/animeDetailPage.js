import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import facepaint from "facepaint";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

const REQDETAILANIME = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
      id
      title {
        romaji
      }
      description
      coverImage {
        extraLarge
      }
      genres
      episodes
      averageScore
    }
  }
`;

function AnimeDetails(props) {
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const onInput = ({ target: { value } }) => setCollectionName(value);

  const openAddDialog = () => {
    setCollectionName("");
    handleShow();
  };

  useEffect(() => {
    if (localStorage.getItem("collections") !== null)
      setCollections(JSON.parse(localStorage.getItem("collections")));
  }, []);

  const { loading, error, data } = useQuery(REQDETAILANIME, {
    variables: {
      id: props.idAnime,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  let genres = "";

  for (let number = 0; number < data.Media.genres.length; number++) {
    if (number !== data.Media.genres.length - 1)
      genres = genres.concat(data.Media.genres[number] + ", ");
    else genres = genres.concat(data.Media.genres[number]);
  }

  console.log(data.Media.genres);

  const CollectionItems = () => {
    console.log(collections);
    if (collections.length <= 0) {
      return (
        <Row>
          <Col>
            <p
              css={mq({
                float: "left",
              })}
            >
              There is no collections yet.
            </p>
          </Col>
          <Col>
            <Button
              onClick={openAddDialog}
              css={mq({
                float: "right",
              })}
            >
              add a collection
            </Button>
          </Col>
        </Row>
      );
    }
    return collections.map((collection, key) => {
      let isInCollections = false;
      isInCollections = collection.listAnime.some((idAnime) => {
        return idAnime === props.idAnime;
      });
      //console.log("felicia " + isInCollections);
      //console.log("hai aku key: " + key);
      return (
        <Row key={key}>
          <Col>
            <Link to="/collections_details" state={{ id: key }}>
              <h4
                css={mq({
                  float: "left",
                })}
              >
                {collection.collectionName}
              </h4>
            </Link>
          </Col>
          <Col>
            {!isInCollections ? (
              <Button
                variant="primary"
                css={mq({
                  float: "right",
                })}
                onClick={() => addToCollection(key)}
              >
                Add to Collection
              </Button>
            ) : (
              <p
                css={mq({
                  float: "right",
                })}
              >
                Already on Collection
              </p>
            )}
          </Col>
        </Row>
      );
    });
  };

  function addToCollection(id) {
    var temp = [...collections];
    temp[id].listAnime.push(props.idAnime);
    localStorage.setItem("collections", JSON.stringify(temp));
    setCollections(temp);
  }

  const saveCollections = () => {
    var arrayOfCollections = [...collections];

    var collection = {
      collectionName: collectionName,
      listAnime: [],
    };
    arrayOfCollections.push(collection);

    localStorage.setItem("collections", JSON.stringify(arrayOfCollections));
    setCollections(arrayOfCollections);
    setShowModal(false);
  };

  return (
    <div
      css={mq({
        paddingTop: "20px",
        paddingBottom: "20px",
      })}
    >
      <Row>
        <Col lg={6} md={12} xs={12}>
          <img
            src={data.Media.coverImage.extraLarge}
            alt={data.Media.coverImage.extraLarge}
          ></img>
        </Col>
        <Col lg={6} md={12} xs={12}>
          <h3>{data.Media.title.romaji}</h3>

          <div dangerouslySetInnerHTML={{ __html: data.Media.description }} />
          <p>Total Episodes: {data.Media.episodes} episodes</p>
          <p>Average Scores: {data.Media.averageScore} out of 100</p>
          <p>Genres: {genres}</p>
          {/* <Button
            variant="primary"
            onClick={() => addToCollection(data.Media.id)}
          >
            add this to local storage
          </Button> */}
          <Row>
            <Col>
              <h3
                css={mq({
                  float: "left",
                })}
              >
                Collection List
              </h3>
            </Col>
            <Col></Col>
          </Row>
          <CollectionItems />
        </Col>
      </Row>
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

function AnimeDetailPage() {
  const location = useLocation();
  const { id } = location.state;
  console.log(id);

  return <AnimeDetails idAnime={id} />;
}

export default AnimeDetailPage;
