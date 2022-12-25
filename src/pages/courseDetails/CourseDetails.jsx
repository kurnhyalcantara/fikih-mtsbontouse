import {
  AccessTimeTwoTone,
  PeopleTwoTone,
  StarRate,
} from '@mui/icons-material';

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeskripsiCourse from './CourseDescription';
import './CourseDetail.css';
import CourseInstructur from './CourseInstructur';
import CourseTesti from './CourseTesti';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const CourseDetails = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { courseId } = useParams();

  const [course, setCourse] = useState([]);

  const [rating, setRating] = useState(0);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      if (courseId) {
        setLoading(true);
        await axios
          .get(`http://localhost:4000/api/course_details/${courseId}`)
          .then((res) => {
            if (res.status === 200) {
              const { courseDetails } = res.data;

              setCourse(res.data);
              setLoading(false);
              const ratings = courseDetails?.comments.map(
                (rating) => rating.rating
              );
              const total = ratings
                .reduce((acc, item) => (acc += item), 0)
                .toFixed(1);
              const rating = total / ratings.length;
              if (rating > 0) {
                setRating(rating);
              } else {
                setRating(0);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    getData();
  }, [courseId]);

  return (
    <div>
      {loading ? (
        <div className="loading">Loading&#8230;</div>
      ) : (
        <Box sx={{ marginTop: { md: '3rem' } }}>
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid item md={3} xs={12} sm={12}>
                <Card>
                  <CardMedia
                    component="img"
                    image={course?.courseDetails?.banner?.url}
                    alt={course?.courseDetails?.title}
                  />
                  <CardContent>
                    <Box className="rating-and-path">
                      <Box className="rating">
                        <StarRate className="star-rating"></StarRate>
                        <Typography className="count-rating">
                          {rating ? rating : '0'}+
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          fontSize: '12px',
                          color: '#a4a4a4',
                          marginX: '0.5rem',
                        }}
                      >
                        •
                      </Box>
                      <Box className="path">
                        <Breadcrumbs>
                          <Link
                            underline="hover"
                            color="inherit"
                            href="/course"
                          >
                            Fikih
                          </Link>
                          <Link underline="hover" color="inherit" href="">
                            {course?.courseDetails?.class ?? 'Kelas 8'}
                          </Link>
                        </Breadcrumbs>
                      </Box>
                    </Box>
                    <Box className="title-and-detail">
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        marginTop="0.5rem"
                      >
                        {course?.courseDetails?.title}
                      </Typography>
                      <button className="tag-course">
                        {course?.courseDetails?.category}
                      </button>
                      <Box className="detailCourse">
                        <Grid container>
                          <Grid
                            item
                            xs={6}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <PeopleTwoTone
                              sx={{ marginRight: '0.2rem' }}
                            ></PeopleTwoTone>
                            <Typography fontSize="14px">
                              {course?.courseDetails?.jumlahSiswa ??
                                '12 Siswa Terdaftar'}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <AccessTimeTwoTone
                              sx={{
                                marginRight: '0.2rem',
                              }}
                            ></AccessTimeTwoTone>
                            <Typography align="center">
                              {course?.courseDetails?.alokasiWaktu ??
                                '4 x 90 Menit'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ padding: '0.8rem' }}>
                    <Button
                      className="bootstraped-button"
                      variant="contained"
                      onClick={() => {
                        navigate(`/enroll_page_student/${courseId}`);
                      }}
                      fullWidth
                      sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                      Gabung
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item md={9} xs={12}>
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      position: 'sticky',
                      top: '70px',
                      zIndex: '24',
                      background: '#fff',
                    }}
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="fullWidth"
                      aria-label="Detail Materi Navigation"
                    >
                      <Tab label="Deskripsi Kelas" />
                      <Tab label="Pengajar" />
                      <Tab label="Testimoni" />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <DeskripsiCourse item={course} />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <CourseInstructur item={course} />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <CourseTesti item={course} />
                  </TabPanel>
                </Box>
              </Grid>
            </Grid>
          </Container>
          <Box
            sx={{ display: { xs: 'block', md: 'none' } }}
            className="button-flow"
          >
            <Button
              className="bootstraped-button"
              variant="contained"
              onClick={() => {
                navigate(`/enroll_page_student/${courseId}`);
              }}
              fullWidth
            >
              Gabung
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default CourseDetails;
