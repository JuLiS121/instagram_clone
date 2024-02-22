import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { ImageObject } from '@/components/shared/PostDetails';

export async function signUpNewUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function signInWithFacebook() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
    if (error) throw error;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function addUser(
  email: string,
  password: string,
  fullName: string,
  username: string
) {
  try {
    const { error } = await supabase
      .from('users')
      .insert({ email, password, fullName, username });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getUsername(userEmail: string | undefined) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('email', userEmail);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostUserId(imageUrl: ImageObject) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('creator')
      .eq('imageUrl', imageUrl)
      .single();
    if (error) throw error;
    return data.creator;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserIdForPosts(postUserId: ImageObject) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', postUserId)
      .single();
    if (error) throw error;
    return data.username;
  } catch (error) {
    console.error(error);
  }
}

// https://ozffekhywobfzhaxhppb.supabase.co/storage/v1/object/public/media/8446904d-3060-4bf5-a8c8-b0afdd8f9623.png

export async function addPost(
  imageUrl: string,
  username: string | undefined,
  caption = ''
) {
  try {
    const { error } = await supabase
      .from('posts')
      .insert({ post_id: uuidv4(), creator: username, imageUrl, caption });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getPosts(username: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('imageUrl')
      .eq('creator', username);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostId(postId: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('post_id')
      .eq('post_id', postId)
      .single();
    if (error) throw error;
    return data.post_id;
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username,profileImg')
      .neq('email', email);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function addLike(postId: string, username: string) {
  try {
    const { error } = await supabase
      .from('likes')
      .insert({ like_id: uuidv4(), post_id: postId, username });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getLikedPost(postId: string) {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select()
      .eq('post_id', postId);
    if (error) throw error;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteLike(postId: string, username: string) {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('username', username);
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getLikedPostId(postId: string, username: string) {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('like_id')
      .eq('post_id', postId)
      .eq('username', username);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function addSave(postId: string, username: string) {
  try {
    const { error } = await supabase
      .from('saved')
      .insert({ saved_id: uuidv4(), post_id: postId, username });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSave(postId: string, username: string) {
  try {
    const { error } = await supabase
      .from('saved')
      .delete()
      .eq('post_id', postId)
      .eq('username', username);
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostLikes(postId: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .eq('post_id', postId);
    if (error) throw error;
    return data.length;
  } catch (error) {
    console.error(error);
  }
}

export async function getSavedPost(username: string) {
  try {
    const { data, error } = await supabase
      .from('saved')
      .select('post_id')
      .eq('username', username);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getFollowers(username: string) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('follower')
      .eq('followed', username);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getFollowing(username: string) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('followed')
      .eq('follower', username);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function follow(username: string, profileUser: string) {
  try {
    const { error } = await supabase
      .from('followers')
      .insert({ id: uuidv4(), followed: profileUser, follower: username });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function unFollow(username: string, profileUser: string) {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower', username)
      .eq('followed', profileUser);
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserProfilePc(username: string) {
  if (username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('profileImg')
        .eq('username', username)
        .single();
      if (error) throw error;
      return data.profileImg;
    } catch (error) {
      console.error(error);
    }
  }
}

export async function addMessage(
  sender: string,
  receiver: string,
  message_text: string
) {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({ message_id: uuidv4(), sender, receiver, message_text });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getConversation(sender: string, receiver: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('message_text,sender,receiver,created_at,message_id')
      .or(`sender.eq.${sender},sender.eq.${receiver}`)
      .or(`receiver.eq.${sender},receiver.eq.${receiver}`);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMyMessages(sender: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender.eq.${sender},receiver.eq.${sender}`);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateBio(username: string, text: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ bio: text })
      .eq('username', username);
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export async function getBio(username: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('bio')
      .eq('username', username)
      .single();
    if (error) throw error;
    return data.bio;
  } catch (error) {
    console.error(error);
  }
}
