import excel from './excel.png'
import word from './word.png'
import ppt from './ppt.png'
import pdf from './pdf.png'
import video from './video.png'
import audio from './audio.png'
import txt from './txt.png'
import zip from './zip.png'
import psd from './psd.png'
import ai from './ai.png'
import svg from './svg.png'
import other from './other.png'

const icons = {
  xls: excel,
  xlsx: excel,
  doc: word,
  docx: word,
  ppt,
  pptx: ppt,
  pdf,
  mp4: video,
  avi: video,
  wmv: video,
  '3gp': video,
  mov: video,
  m4v: video,
  asf: video,
  asx: video,
  rm: video,
  rmvb: video,
  mkv: video,
  flv: video,
  vob: video,
  dat: video,
  mp3: audio,
  aac: audio,
  wma: audio,
  amr: audio,
  flac: audio,
  ape: audio,
  ogg: audio,
  midi: audio,
  vqf: audio,
  txt,
  zip,
  rar: zip,
  '7z': zip,
  tar: zip,
  gz: zip,
  psd,
  ai,
  svg
}

export const getExtIcon = ext => icons[ext] || other
