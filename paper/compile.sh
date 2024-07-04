#! /bin/bash

pdf="pdflatex agent-based-model.tex"
bib="biber agent-based-model"

$pdf
$bib
$pdf
$pdf