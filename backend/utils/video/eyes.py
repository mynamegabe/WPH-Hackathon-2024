import cv2
import numpy as np


# init part
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')
detector_params = cv2.SimpleBlobDetector_Params()
detector_params.filterByArea = True
detector_params.maxArea = 1500
detector = cv2.SimpleBlobDetector_create(detector_params)


def detect_faces(img, cascade):
    gray_frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    coords = cascade.detectMultiScale(gray_frame, 1.3, 5)
    if len(coords) > 1:
        biggest = (0, 0, 0, 0)
        for i in coords:
            if i[3] > biggest[3]:
                biggest = i
        biggest = np.array([i], np.int32)
    elif len(coords) == 1:
        biggest = coords
    else:
        return None
    for (x, y, w, h) in biggest:
        frame = img[y:y + h, x:x + w]
    return frame


def detect_eyes(img, cascade):
    gray_frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    eyes = cascade.detectMultiScale(gray_frame, 1.3, 5)  # detect eyes
    width = np.size(img, 1)  # get face frame width
    height = np.size(img, 0)  # get face frame height
    left_eye = None
    right_eye = None
    left_eye_center = None
    right_eye_center = None
    for (x, y, w, h) in eyes:
        if y > height / 2:
            pass
        eyecenter = x + w / 2  # get the eye center
        if eyecenter < width * 0.5:
            left_eye = img[y:y + h, x:x + w]
            left_eye_center = eyecenter
        else:
            right_eye = img[y:y + h, x:x + w]
            right_eye_center = eyecenter
    return (left_eye, right_eye), (left_eye_center, right_eye_center)


def cut_eyebrows(img):
    height, width = img.shape[:2]
    eyebrow_h = int(height / 4)
    img = img[eyebrow_h:height, 0:width]  # cut eyebrows out (15 px)

    return img


def blob_process(img, threshold, detector):
    gray_frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, img = cv2.threshold(gray_frame, threshold, 255, cv2.THRESH_BINARY)
    img = cv2.erode(img, None, iterations=2)
    img = cv2.dilate(img, None, iterations=4)
    img = cv2.medianBlur(img, 5)
    keypoints = detector.detect(img)
    # print(keypoints)
    return keypoints


def nothing(x):
    pass


def main():
    cap = cv2.VideoCapture(0)
    # cap = cv2.VideoCapture('eye_recording.flv')
    cv2.namedWindow('image')
    cv2.createTrackbar('threshold', 'image', 0, 255, nothing)
    while True:
        _, frame = cap.read()
        face_frame = detect_faces(frame, face_cascade)
        if face_frame is not None:
            eyes, centers = detect_eyes(face_frame, eye_cascade)
            for eye in eyes:
                if eye is not None:
                    threshold = r = cv2.getTrackbarPos('threshold', 'image')
                    eye = cut_eyebrows(eye)
                    keypoints = blob_process(eye, threshold, detector)
                    # if len(keypoints) > 0:
                    #     if len(keypoints[0].pt) > 0:
                    #         print(keypoints[0].pt)
                    getDirection(eye, keypoints)
                    eye = cv2.drawKeypoints(eye, keypoints, eye, (0, 0, 255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
        cv2.imshow('image', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    

def getDirection(eye, positions): # eye, keypoints
    if len(positions) == 0:
        return
    # get shape of eye
    height, width = eye.shape[:2]
    # get center of eye
    eye_center = (width/2, height/2)
    # get position of keypoints
    x, y = positions[0].pt
    # get direction
    if x < eye_center[0]:
        # print("left")
        print("right") # camera is flipped
        return "right"
    else:
        # print("right")
        print("left") # camera is flipped 
        return "left"
        
    
def checkEyes(filename: str):
    gaze = {
        "left": 0,
        "right": 0
    }
    cap = cv2.VideoCapture(filename)
    # cap = cv2.VideoCapture('eye_recording.flv')
    # cv2.namedWindow('image')
    # cv2.createTrackbar('threshold', 'image', 0, 255, nothing)
    threshold = 105
    try:
        while cap.isOpened():
            _, frame = cap.read()
            face_frame = detect_faces(frame, face_cascade)
            if face_frame is not None:
                eyes, centers = detect_eyes(face_frame, eye_cascade)
                for eye in eyes:
                    if eye is not None:
                        # threshold = r = cv2.getTrackbarPos('threshold', 'image')
                        eye = cut_eyebrows(eye)
                        keypoints = blob_process(eye, threshold, detector)
                        # if len(keypoints) > 0:
                        #     if len(keypoints[0].pt) > 0:
                        #         print(keypoints[0].pt)
                        direction = getDirection(eye, keypoints)
                        if direction:
                            print(direction)
                            gaze[direction] += 1
                        eye = cv2.drawKeypoints(eye, keypoints, eye, (0, 0, 255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
            cv2.imshow('image', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    except Exception as e:
        print(e)
    finally:
        cap.release()
        cv2.destroyAllWindows()
    
    # write results to file
    with open("eye_results.txt", "w") as file:
        file.write(f"Left: {gaze['left']}\nRight: {gaze['right']}\n")
    
    return gaze["left"], gaze["right"]
    



if __name__ == "__main__":
    main()