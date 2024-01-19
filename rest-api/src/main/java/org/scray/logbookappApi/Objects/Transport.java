package org.scray.logbookappApi.Objects;

public class Transport {
    private String categorie;
    private double emissionFaktor;

    private int besetzungsrad;
    private String kraftstoff;

    private double specVerbrauch;


    public Transport(String categorie, double emissionFaktor, int besetzungsrad, String kraftstoff, double specVerbrauch) {
        this.categorie = categorie;
        this.emissionFaktor = emissionFaktor;
        this.besetzungsrad = besetzungsrad;
        this.kraftstoff = kraftstoff;
        this.specVerbrauch = specVerbrauch;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public double getEmissionFaktor() {
        return emissionFaktor;
    }

    public void setEmissionFaktor(float emissionFaktor) {
        this.emissionFaktor = emissionFaktor;
    }

    public int getBesetzungsrad() {
        return besetzungsrad;
    }

    public void setBesetzungsrad(int besetzungsrad) {
        this.besetzungsrad = besetzungsrad;
    }

    public String getKraftstoff() {
        return kraftstoff;
    }

    public void setKraftstoff(String kraftstoff) {
        this.kraftstoff = kraftstoff;
    }

    public double getSpecVerbrauch() {
        return specVerbrauch;
    }

    public void setSpecVerbrauch(float specVerbrauch) {
        this.specVerbrauch = specVerbrauch;
    }
}
