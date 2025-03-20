import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Avatar,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

// --- Data and Utility Functions ---
const hdPlaceholderImages = [
  'https://picsum.photos/600/600',
  'https://picsum.photos/601/601',
  'https://picsum.photos/602/602',
  'https://picsum.photos/603/603',
  'https://picsum.photos/604/604',
];

const getRandomHdImage = () => hdPlaceholderImages[Math.floor(Math.random() * hdPlaceholderImages.length)];

const getRandomIndianName = () => {
  const firstNames = ['Aarav', 'Aditi', 'Advait', 'Akanksha', 'Amit', 'Ananya', 'Arjun', 'Aisha', 'Aryan'];
  const lastNames = ['Agarwal', 'Banerjee', 'Chakraborty', 'Chatterjee', 'Das', 'Desai', 'Gandhi'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const getRandomPostContent = () => {
  const sentences = [
    'Just had an amazing day!',
    'Feeling inspired today.',
    'What are your thoughts on this?',
    'Check out this cool link.',
    'Having a great time with friends.',
    'Learning something new every day.',
    'This is so interesting!',
    'Can\'t wait for the weekend.',
    'Enjoying the little things.',
  ];
  return sentences[Math.floor(Math.random() * sentences.length)];
};

// --- Mock API ---
const useMockApi = () => {
  const fetchInitialData = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const users = Array.from({ length: 10 }, () => ({
      userId: `user-${Math.random().toString(36).substring(2, 9)}`,
      userName: getRandomIndianName(),
      userImage: getRandomHdImage(),
    }));
    const posts = Array.from({ length: 20 }, () => ({
      postId: `post-${Math.random().toString(36).substring(2, 9)}`,
      authorId: users[Math.floor(Math.random() * users.length)].userId,
      postContent: getRandomPostContent(),
      postTime: Date.now() - Math.floor(Math.random() * 1000000),
      postImage: getRandomHdImage(),
    }));
    const comments = Array.from({ length: 50 }, () => ({
      commentId: `comment-${Math.random().toString(36).substring(2, 9)}`,
      postId: posts[Math.floor(Math.random() * posts.length)].postId,
      commenterId: users[Math.floor(Math.random() * users.length)].userId,
      commentContent: getRandomPostContent(),
      commentTime: Date.now() - Math.floor(Math.random() * 500000),
    }));
    return { users, posts, comments };
  }, []);
  
  const fetchNewData = useCallback(async (lastTimestamp, currentUsers) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newPosts = Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
      postId: `new-post-${Math.random().toString(36).substring(2, 9)}`,
      authorId: currentUsers[Math.floor(Math.random() * currentUsers.length)].userId,
      postContent: getRandomPostContent(),
      postTime: Date.now(),
      postImage: getRandomHdImage(),
    }));
    const newComments = Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
      commentId: `new-comment-${Math.random().toString(36).substring(2, 9)}`,
      postId: `post-${Math.floor(Math.random() * 20) + 1}`,
      commenterId: currentUsers[Math.floor(Math.random() * currentUsers.length)].userId,
      commentContent: getRandomPostContent(),
      commentTime: Date.now(),
    }));
    return { newPosts, newComments };
  }, []);
  
  return { fetchInitialData, fetchNewData };
};

// --- Styled Components ---
const useStyledComponents = () => {
  const CardWrapper = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    boxShadow: theme.shadows[2],
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
  }));

  const CardContentWrapper = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  }));

  const UserAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2),
  }));

  const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.primary.dark,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }));

  return { CardWrapper, CardContentWrapper, UserAvatar, SectionTitle };
};

// --- UI Components ---
const User = ({ user }) => {
  const { CardWrapper, CardContentWrapper, UserAvatar } = useStyledComponents();
  return (
    <CardWrapper sx={{ display: 'flex', alignItems: 'center' }}>
      <UserAvatar src={user.userImage} alt={user.userName} />
      <CardContentWrapper sx={{ p: 0, flex: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {user.userName}
        </Typography>
      </CardContentWrapper>
    </CardWrapper>
  );
};

const Post = ({ post, user }) => {
  const { CardWrapper, CardContentWrapper, UserAvatar } = useStyledComponents();
  return (
    <CardWrapper>
      <CardContentWrapper>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <UserAvatar src={user.userImage} alt={user.userName} />
          <Typography variant="subtitle1" fontWeight="bold">
            {user.userName}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          {post.postContent}
        </Typography>
        {post.postImage && (
          <Box sx={{
            mt: 1,
            width: '100%',
            height: 0,
            paddingBottom: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1.5,
          }}>
            <CardMedia
              component="img"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              image={post.postImage}
              alt="Post"
            />
          </Box>
        )}
      </CardContentWrapper>
    </CardWrapper>
  );
};

const TopUsers = ({ users, userPostCounts }) => {
  const { SectionTitle } = useStyledComponents();
  const sortedUsers = users
    .slice()
    .sort((a, b) => (userPostCounts[b.userId] || 0) - (userPostCounts[a.userId] || 0))
    .slice(0, 5);

  return (
    <Box sx={{ mb: 4 }}>
      <SectionTitle variant="h6">Top Users</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      {sortedUsers.map((user) => (
        <User key={user.userId} user={user} />
      ))}
    </Box>
  );
};

const Feed = ({ posts, users }) => {
  const { SectionTitle } = useStyledComponents();
  return (
    <Box>
      <SectionTitle variant="h6">Feed</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      {posts.map((post) => {
        const user = users.find((u) => u.userId === post.authorId);
        return <Post key={post.postId} post={post} user={user} />;
      })}
    </Box>
  );
};

const AppInner = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [userPostCounts, setUserPostCounts] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const { fetchInitialData, fetchNewData } = useMockApi();

  useEffect(() => {
    const loadInitialData = async () => {
      const { users, posts, comments } = await fetchInitialData();
      setUsers(users);
      setPosts(posts.sort((a, b) => b.postTime - a.postTime));
      setComments(comments);
      setLastTimestamp(Date.now());
      const counts = posts.reduce((acc, post) => {
        acc[post.authorId] = (acc[post.authorId] || 0) + 1;
        return acc;
      }, {});
      setUserPostCounts(counts);
    };

    loadInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const updateFeed = async () => {
      const { newPosts, newComments } = await fetchNewData(lastTimestamp, users);
      if (newPosts.length > 0 || newComments.length > 0) {
        setLastTimestamp(Date.now());
        setPosts((prevPosts) => [...newPosts, ...prevPosts].sort((a, b) => b.postTime - a.postTime));
        setComments((prevComments) => [...newComments, ...prevComments]);
        setUserPostCounts((prevCounts) => {
          const newCounts = { ...prevCounts };
          newPosts.forEach((post) => {
            newCounts[post.authorId] = (newCounts[post.authorId] || 0) + 1;
          });
          return newCounts;
        });
      }
    };

    const intervalId = setInterval(updateFeed, 5000);
    return () => clearInterval(intervalId);
  }, [lastTimestamp, users, fetchNewData]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Social Media Analytics
      </Typography>
      <Grid container spacing={isMobile ? 2 : 4}>
        <Grid item xs={12} md={4}>
          <TopUsers users={users} userPostCounts={userPostCounts} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Feed posts={posts} users={users} />
        </Grid>
      </Grid>
    </Container>
  );
};

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#64b5f6',
        dark: '#1565c0',
      },
      secondary: {
        main: '#ffb74d',
      },
      background: {
        default: '#f5f5f5',
        paper: '#fff',
      },
      text: {
        primary: '#333',
        secondary: '#666',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        marginBottom: '1rem',
        color: '#333',
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
    },
    components: {
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: '#ddd',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppInner />
    </ThemeProvider>
  );
};

export default App;
