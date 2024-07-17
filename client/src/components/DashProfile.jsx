import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signOutSuccess, signOutFailure } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [deleteUserSuccess, setDeleteUserSuccess] = useState(null);
  const [deleteUserError, setDeleteUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed: " + error.message);
        setImageUploadProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadUrl) => {
            setImageFileUrl(downloadUrl);
            setFormData({ ...formData, profilePicture: downloadUrl });
            setImageUploadProgress(null);
          }
        )
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Please fill in at least one field");
      return;
    }
    if (imageUploadProgress !== null) {
      setUpdateUserError("Please wait for image to upload")
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserError(null);
        setShowError(false);

        let updateMessage = "Updated: ";
        const updates = [];
        if (formData.username && formData.username !== currentUser.username) {
          updates.push("username");
        }
        if (formData.email && formData.email !== currentUser.email) {
          updates.push("email");
        }
        if (formData.password) {
          updates.push("password");
        }
        if (formData.profilePicture) {
          updates.push("profile picture");
        }
        updateMessage += updates.join(", ");
        setUpdateUserSuccess(updateMessage);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      setShowError(true);
    }
  }

  const handleDelete = async () => {
    setDeleteUserSuccess(null);
    setDeleteUserError(null);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
        setDeleteUserError(data.message);
        setShowError(true);
      } else {
        dispatch(deleteSuccess(data));
        setDeleteUserError(null);
        setShowError(false);
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
      setDeleteUserError(error.message);
      setShowError(true);
    }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/sign-out', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutFailure(data.message));
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }

  useEffect(() => {
    const clearAlerts = () => {
      setUpdateUserSuccess(null);
      setUpdateUserError(null);
      setDeleteUserSuccess(null);
      setDeleteUserError(null);
    };

    if (updateUserSuccess || updateUserError || deleteUserSuccess || deleteUserError) {
      const timer = setTimeout(clearAlerts, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateUserSuccess, updateUserError, deleteUserSuccess, deleteUserError]);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
          {imageUploadProgress && (
            <CircularProgressbar value={imageUploadProgress || 0}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
            style={{ opacity: imageUploadProgress ? imageUploadProgress / 100 : 1 }}
          />
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setShowDeleteModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess &&
        (<Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>)
      }
      {updateUserError &&
        (<Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>)
      }
      {deleteUserSuccess &&
        (<Alert color='success' className='mt-5'>
          {deleteUserSuccess}
        </Alert>)
      }
      {deleteUserError &&
        (<Alert color='failure' className='mt-5'>
          {deleteUserError}
        </Alert>)
      }
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <HiOutlineExclamationCircle className='w-10 h-10 text-red-500 dark:text-red-400 mx-auto mb-4' />
          <div className='flex flex-col gap-4 text-center'>
            <h3>Are you sure you want to delete your account?</h3>
          </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-center gap-4'>
          <Button color='green' onClick={() => setShowDeleteModal(false)}>No, Cancel</Button>
          <Button color='red' onClick={handleDelete}>Yes, I'm sure</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showError} onClose={() => setShowError(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <Alert color='failure'>{error}</Alert>
        </Modal.Body>
      </Modal>
    </div>
  )
}