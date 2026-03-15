import './style.css';

import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  "type": "service_account",
  "project_id": "share-2edd0",
  "private_key_id": "5a9869039c351b0402980b7baf753f8886fbd138",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgKg3Bmt7/R6yF\nWkURIo9hErjjtYBjy2PCMg/G/LHqCpdt/vUJZUHOyJZrymJe9NCXkZHbO736Nvw1\nbfqWv7DBgB3zfJuBrEIx4haIDkf2HqypBRBNhIAo8ffZGCv3wIsha+C/fKt2QzLS\nWV0dh2GUXPhHbqgubbp2g0u3+0zB/WvoNgCxwVNrV1NuBPWnO1TiLDnpNBOV1C9G\nUt4eGsmZPf4rY3qKLw1E4Ghd7mT5kPND+nXgy1t8LcRcC/jUyEINx+7Sfm0ediuD\nfn4iYEJHIpv/B9vM6JlgM5p7WHJOQGyk0bSUvWGQvn7zi0cQj4n6UNXOVmtkdDn+\nyeq77aIRAgMBAAECggEAMI0e92n1oGf/PbtkBXI3CYOt5WUfQuEkX/lh+/2dByfn\nyJHJgOwfe0omAw3qLQPEebXIg69EAyYI5T9t/6WjNL0cFzPWRgRMWqfBEcRWfx7E\nU0Y0L3NzkDXtXnNr3KIS6vIzQojNxz9OmCI7zlg8NcfLAYhjVhOwOv3JBcAZgBJR\n8KrMLm+8AX3KUw5JQqdZZbkHG//96WS9lkcN68qRmkPajwMZUFMnh+UhJZ6PGxVg\np7phPcF6q3QhukQRo3Br7p7k3VnbNzYZ03o50K24VTv3q6W4Brq8KVF0mYM4bwlG\nUevXG2mx4GJlZ6QopZ+1HBzJa5X7ECfhG4u1zxVIIwKBgQDTySUWJIvxbuBvWoST\ntb9CB279PU2GvJVluSUQDFJQB6mBbCNxnhyXr7AMjPnvmXtKLtVGlVcmHXS0+Wp/\nBhJqgv6DOkzO3JhXA+oLTjPCaznsWhInEA1Qoy0JTn0oykK2lFBX0+snLX9XU+YV\n3KD39YIzEUrV3UZZjLo/wgWyIwKBgQDBmgIrjVT/1JxQdLtC20fYkfDNc7JqHae3\n52K5qpyCWJ/ZPPhy53c8ek5996fIp+K9AmviXrPq+tvc5jFyL26VfowdgjAnnw9/\nrNdhlQTeTRvTUwM6RrHlSjWy4QZTwA54p1WEbQ1BU2ZbVAkofqWbVMxmSQ2WAMkH\nA6zuQBNcOwKBgEFTXwwoc74h/Dp8yj4hpoAAePzGBv7TdqWs6UC8/DrRUjiomXo3\nUgx71arZZVLBneTw8zpVYE9ScKhN8sqBnfaat1TVC9IW+yqD+5JHKfIDTxeXZNgF\nvIWt/3tKaZLGaLOWpf2hUXyBLTFLoMIHjuNNKD8GS3YSTdvba6u09jrPAoGAKEOd\ne+1S5joToHAGmir80D/Z8wDC9GrifM70q2SeVEWWSRnzGgKlu8A8Htqo3IR+FY0x\nXs0PYil2HIULd5IBz7mX7nMrDLJ6CLWrvbG+Z3Vl+hdjrnURfnxmmqNOK5Df8Zvr\nnzUG8rUjro7VsMRWMO377LH4z1+ub3UGPC67WA0CgYBrIymqN9NrQ1cuTsJ+CRIg\neRfMs+g4dXbJwEyXxwhH3E6m4RN+0nv+NhsXX6HlMG8RbfGoxIs1iFgw8S7nsR6o\nprvh/JucTJmyqtIdeLEJvSN+yvP7vK2ho2yzs6qUxExvgdyiGhHkno0zpr8D/Xu5\nbchfX7oA+cl9dUJhM/cNKA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@share-2edd0.iam.gserviceaccount.com",
  "client_id": "110040794078171337080",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40share-2edd0.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

// 1. Setup media sources

webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;
  webcamButton.disabled = true;
};

// 2. Create an offer
callButton.onclick = async () => {
  // Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  callInput.value = callDoc.id;

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await callDoc.set({ offer });

  // Listen for remote answer
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  answerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });

  hangupButton.disabled = false;
};

// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
  const callId = callInput.value;
  const callDoc = firestore.collection('calls').doc(callId);
  const answerCandidates = callDoc.collection('answerCandidates');
  const offerCandidates = callDoc.collection('offerCandidates');

  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === 'added') {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};
