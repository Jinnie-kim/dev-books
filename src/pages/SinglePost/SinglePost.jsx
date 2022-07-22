import './singlePost.css';
import { BasicNav } from '../../components/Navbar/Navbar';
import Comment from '../../components/Comment/Comment';
import { Content } from '../../components/Content/Content';
import PostComment from '../../components/PostComment/PostComment';
import Topbar from '../../components/Topbar/Topbar';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function SinglePost() {
  // 유저 프로필 상태
  const [userProfileImg, setUserProfileImg] = useState('');

  // 유저 닉네임 상태
  const [userName, setUserName] = useState('');

  // 유저 id 상태
  const [userId, setUserId] = useState('');

  // 게시글 내용 상태
  const [contentText, setContentText] = useState('');

  // 게시글 이미지 상태
  const [contentImg, setContentImg] = useState([]);

  // 좋아요 count 상태
  const [likeCount, setLikeCount] = useState('');

  // 댓글 개수 상태
  const [commentCount, setCommentCount] = useState('');

  // 포스트 업로드 날짜
  const [uploadDate, setUploadDate] = useState('');

  // 댓글 내용 상태 useRef
  const commentText = useRef();

  // 댓글 작성 유저 프로필 이미지
  const [commentProfile, setCommentProfile] = useState('');

  // 댓글 불러오기 정보 상태
  const [content, setContent] = useState([]);

  // 포스트 고유 아이디
  const location = useLocation();
  const postUniqueId = location.state.postId;

  // 사용할 url, token, accountname
  const url = 'https://mandarin.api.weniv.co.kr';
  const token = window.localStorage.getItem('token');

  // 게시글 정보
  const getPostInfo = async () => {
    const postInfoPath = `/post/${postUniqueId}`;

    try {
      const res = await fetch(url + postInfoPath, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      const json = await res.json();
      setUserProfileImg(json.post.author.image);
      setCommentProfile(json.post.author.image);
      setUserName(json.post.author.username);
      setUserId(json.post.author.accountname);
      setContentText(json.post.content);
      if (json.post.image.split(',')[0] === '') {
        setContentImg([]);
      } else {
        setContentImg(json.post.image.split(','));
      }
      setLikeCount(json.post.heartCount);
      setCommentCount(json.post.commentCount);
      setUploadDate(
        json.post.createdAt
          .slice(0, 11)
          .replace('-', '년 ')
          .replace('-', '월 ')
          .replace('T', '일')
      );
    } catch (error) {}
  };

  useEffect(() => {
    getPostInfo();
  }, []);

  // 댓글 작성
  const createComment = async () => {
    const commentReqPath = `/post/${postUniqueId}/comments`;

    try {
      if (commentText.current.value === '') {
        alert('댓글을 입력해주세요.');
      } else {
        const res = await fetch(url + commentReqPath, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            comment: {
              content: commentText.current.value,
            },
          }),
        });
        const json = await res.json();
        commentText.current.value = '';
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글 불러오기
  const getCommentList = async () => {
    const commentListPath = `/post/${postUniqueId}/comments`;

    try {
      const res = await fetch(url + commentListPath, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      const json = await res.json();
      const commentInfo = json.comments;
      setContent(commentInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommentList();
  }, []);

  return (
    <div className="singlePostWrap">
      <Topbar />
      <BasicNav />
      <section className="singlePostMain">
        <section className="singlePostContainer">
          <Content
            userImg={userProfileImg}
            userName={userName}
            userId={userId}
            posttext={contentText}
            postImg={contentImg}
            heartNum={likeCount}
            commentNum={commentCount}
            postDate={uploadDate}
          />
        </section>
        <ul className="postCommentWrap">
          <PostComment postUniqueId={postUniqueId} commentInfo={content} />
        </ul>
      </section>
      <Comment
        ref={commentText}
        click={createComment}
        profile={commentProfile}
      />
    </div>
  );
}
