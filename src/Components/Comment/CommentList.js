import { React, useState } from 'react';
import styled from 'styled-components';

// Icons
import { AiFillHeart } from 'react-icons/ai';
import { AiFillMessage } from 'react-icons/ai';
import { BsFillHandThumbsUpFill } from 'react-icons/bs';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import axios from 'axios';

const CommentList = ({
  reCmt,
  setReCmt,
  data,
  logoWidth,
  commentWidth,
  winId,
}) => {
  const [cmtContent, setCmtContent] = useState('');

  const [cmtOpen, setCmtOpen] = useState(false);

  const [commentLikeCount, setCommentLikeCount] = useState(data.likeCount);
  const [isLiked, setIsLiked] = useState(data.isLiked);

  const userFirstText = name => {
    const firstText = name[0];
    return firstText;
  };
  const reCmtHandler = () => {
    switch (cmtOpen) {
      case true:
        setCmtOpen(false);
        break;
      case false:
        setCmtOpen(true);
        break;
    }
  };
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
    Authorization: sessionStorage.getItem('token'),
  };

  const dateHandler = date => {
    const day = date.split('T')[0];
    return day;
  };

  const cmtContentHandler = e => {
    setCmtContent(e.target.value);
  };

  const postCmtHandler = id => {
    const cmtData = {
      parentId: id,
      content: cmtContent,
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_HOST}/comment/${winId}`, cmtData, {
        headers,
      })
      .then(res => {
        if (res.status === 201) {
          if (reCmt) setReCmt(false);
          else setReCmt(true);
          setCmtOpen(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    return axios;
  };

  const likeHandler = id => {
    const data = {
      commentId: id,
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_HOST}/comment-like`, data, {
        headers,
      })
      .then(() => {
        if (isLiked) {
          setCommentLikeCount(commentLikeCount - 1);
          setIsLiked(false);
        } else {
          setCommentLikeCount(commentLikeCount + 1);
          setIsLiked(true);
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <Comments>
        <UserLogo logoWidth={logoWidth}>
          {userFirstText(`${data.author}`)}
        </UserLogo>
        <InfoAndFunction>
          <CommentInfo commentWidth={commentWidth}>
            <UserAndDate>
              <CommentUser>{data.author}</CommentUser>
              <CommentDate>{dateHandler(data.createdAt)}</CommentDate>
            </UserAndDate>
            <CommentContent>{data.content}</CommentContent>
          </CommentInfo>
          <CommentFunctions>
            <LeftFunction>
              <AiFillHeart
                className="heart"
                onClick={() => likeHandler(data.id)}
                style={isLiked ? { color: 'red' } : { color: '#808080' }}
              />
              <span className="heartCount">
                {commentLikeCount === 0 ? null : commentLikeCount}
              </span>
              <AiFillMessage onClick={reCmtHandler} className="recomment" />

              <BiDotsHorizontalRounded className="miniMore" />
            </LeftFunction>
            <RightFunction
              onClick={() => {
                alert('준비중입니다');
              }}
            >
              <BsFillHandThumbsUpFill className="useful" />
              <span className="usefulCount">유용함</span>
            </RightFunction>
          </CommentFunctions>
        </InfoAndFunction>
      </Comments>
      {cmtOpen ? (
        <ReCommentArea>
          <LogoAndComment>
            <ReUserLogo>{userFirstText(`${data.author}`)}</ReUserLogo>
            <AddReComment onChange={cmtContentHandler} />
          </LogoAndComment>
          <ButtonArea>
            <CancelBtn onClick={reCmtHandler}>취소</CancelBtn>
            <CompleteBtn onClick={() => postCmtHandler(data.id)}>
              완료
            </CompleteBtn>
          </ButtonArea>
        </ReCommentArea>
      ) : null}
    </>
  );
};
const Comments = styled.section`
  display: flex;
  margin-top: 20px;
  float: right;
`;

const UserLogo = styled.section`
  width: ${props => props.logoWidth};
  height: ${props => props.logoWidth};
  line-height: ${props => props.logoWidth};
  border: 0;
  border-radius: 50%;
  text-align: center;
  background-color: rgb(237, 237, 237);
`;

const InfoAndFunction = styled.section`
  display: flex;
  flex-direction: column;
`;

const CommentInfo = styled.section`
  width: ${props => props.commentWidth};
  margin-left: 15px;
  border: 1px solid lightgrey;
  border-radius: 15px;
`;

const UserAndDate = styled.section`
  display: flex;
  padding: 12px 12px 0 12px;
`;

const CommentUser = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const CommentDate = styled.span`
  margin-left: 12px;
  font-size: 14px;
`;

const CommentContent = styled.p`
  margin-top: 5px;
  padding: 0 12px 12px 12px;
  font-size: 12px;
`;

const CommentFunctions = styled.section`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-left: 15px;
`;

const LeftFunction = styled.section`
  position: relative;
  .heart {
    margin-right: 30px;
    color: grey;
  }

  .recomment {
    color: grey;
    margin-right: 30px;
  }

  .miniMore {
    color: grey;
    margin-right: 30px;
  }

  .heartCount {
    position: absolute;
    margin-top: 4px;
    margin-left: -28px;
    font-size: 14px;
    color: grey;
  }
`;

const RightFunction = styled.section`
  display: flex;
  position: relative;
  .useful {
    color: grey;
  }

  .usefulCount {
    margin-top: 5px;
    text-align: center;
    font-size: 14px;
    color: grey;
  }
`;

const ReCommentArea = styled.section`
  display: flex;
  flex-direction: column;
  float: right;
`;

const LogoAndComment = styled.section`
  display: flex;
`;

const ButtonArea = styled.section`
  display: flex;
  margin-top: 10px;
  margin-left: 270px;
`;

const CancelBtn = styled.button`
  width: 60px;
  height: 40px;
  border-radius: 24px;
  margin-right: 15px;
  border: none;
  cursor: pointer;
`;
const CompleteBtn = styled.button`
  width: 60px;
  height: 40px;
  border-radius: 24px;
  border: none;
`;

const ReUserLogo = styled.section`
  margin-top: 15px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  margin-right: 15px;
  border: 0;
  border-radius: 50%;
  text-align: center;
  background-color: rgb(237, 237, 237);
`;

const AddReComment = styled.textarea`
  outline: none;
  resize: none;
  width: 356px;
  height: 56px;
  margin-top: 15px;
  border: 1px solid lightgrey;
  border-radius: 15px;
`;

export default CommentList;
